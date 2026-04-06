#!/bin/bash

################################################################################
# BabyGuardian Backend - Script de despliegue automático en VPS
#
# Uso: bash deploy-vps.sh
#
# Este script automatiza completamente el despliegue del backend NestJS en
# un servidor Ubuntu/Debian con nginx y certificado SSL Let's Encrypt.
################################################################################

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir
log() {
  echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
  echo -e "${GREEN}✓${NC} $1"
}

error() {
  echo -e "${RED}✗${NC} $1"
  exit 1
}

warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Banner
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  BabyGuardian Backend - Despliegue VPS Automático          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar que se ejecuta como root
if [[ $EUID -ne 0 ]]; then
  error "Este script debe ejecutarse como root (usa: sudo bash deploy-vps.sh)"
fi

# ============================================================================
# CONFIGURACIÓN INICIAL
# ============================================================================

log "Recopilando información necesaria..."
echo ""

# Dominio
read -p "Dominio (ej: babyguardian.golinkia.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
  error "El dominio es obligatorio"
fi

# Email para certificado SSL
read -p "Email para certificado SSL (ej: admin@golinkia.com): " EMAIL
if [ -z "$EMAIL" ]; then
  error "El email es obligatorio"
fi

# Contraseña PostgreSQL
read -sp "Contraseña para usuario PostgreSQL babyguardian: " DB_PASSWORD
echo ""
if [ -z "$DB_PASSWORD" ]; then
  error "La contraseña de PostgreSQL es obligatoria"
fi

# Ruta del backend (por defecto el directorio actual)
BACKEND_PATH="${1:-.}"
BACKEND_PATH="$(cd "$BACKEND_PATH" && pwd)"

if [ ! -f "$BACKEND_PATH/package.json" ]; then
  error "No se encontró package.json en $BACKEND_PATH"
fi

success "Configuración inicial completada"
echo ""

# ============================================================================
# PASO 1: INSTALAR DEPENDENCIAS DEL SISTEMA
# ============================================================================

log "PASO 1: Instalando dependencias del sistema..."

apt-get update > /dev/null 2>&1 || true

# Instalar paquetes necesarios
packages_to_install=()
command -v git >/dev/null 2>&1 || packages_to_install+=("git")
command -v curl >/dev/null 2>&1 || packages_to_install+=("curl")
command -v nginx >/dev/null 2>&1 || packages_to_install+=("nginx")
command -v certbot >/dev/null 2>&1 || packages_to_install+=("certbot" "python3-certbot-nginx")
command -v psql >/dev/null 2>&1 || packages_to_install+=("postgresql" "postgresql-contrib")

if [ ${#packages_to_install[@]} -gt 0 ]; then
  log "Instalando: ${packages_to_install[@]}"
  apt-get install -y "${packages_to_install[@]}" > /dev/null 2>&1
fi

# Instalar Node.js 20 si no existe
if ! command -v node &> /dev/null || [ "$(node -v | cut -d. -f1 | cut -dv -f2)" -lt 20 ]; then
  log "Instalando Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - > /dev/null 2>&1
  apt-get install -y nodejs > /dev/null 2>&1
fi

NODE_VERSION=$(node --version)
success "Node.js $NODE_VERSION instalado"

# ============================================================================
# PASO 2: CREAR USUARIO Y DIRECTORIOS
# ============================================================================

log "PASO 2: Creando usuario y directorios..."

if ! id -u babyguardian > /dev/null 2>&1; then
  useradd --system --shell /bin/bash --create-home babyguardian
  success "Usuario 'babyguardian' creado"
else
  warning "Usuario 'babyguardian' ya existe"
fi

mkdir -p /opt/babyguardian/backend
chown -R babyguardian:babyguardian /opt/babyguardian

success "Directorios creados"

# ============================================================================
# PASO 3: COPIAR CÓDIGO DEL BACKEND
# ============================================================================

log "PASO 3: Copiando código del backend..."

# Si se ejecuta desde el mismo directorio, copiar todo
if [ "$(basename "$BACKEND_PATH")" == "backend" ]; then
  cp -r "$BACKEND_PATH"/* /opt/babyguardian/backend/ 2>/dev/null || true
  cp -r "$BACKEND_PATH"/.[^.]* /opt/babyguardian/backend/ 2>/dev/null || true
else
  cp -r "$BACKEND_PATH"/* /opt/babyguardian/backend/ 2>/dev/null || true
  cp -r "$BACKEND_PATH"/.[^.]* /opt/babyguardian/backend/ 2>/dev/null || true
fi

chown -R babyguardian:babyguardian /opt/babyguardian/backend

success "Código copiado a /opt/babyguardian/backend/"

# ============================================================================
# PASO 4: CREAR BASE DE DATOS POSTGRESQL
# ============================================================================

log "PASO 4: Configurando PostgreSQL..."

# Esperar a que PostgreSQL esté listo
sleep 2

# Crear usuario y base de datos
sudo -u postgres psql > /dev/null 2>&1 <<EOF
-- Crear usuario si no existe
DO \$\$ BEGIN
  CREATE USER babyguardian WITH PASSWORD '$DB_PASSWORD';
EXCEPTION WHEN DUPLICATE_OBJECT THEN
  NULL;
END \$\$;

-- Crear base de datos si no existe
SELECT 'CREATE DATABASE babyguardian_prod OWNER babyguardian'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'babyguardian_prod')\gexec

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE babyguardian_prod TO babyguardian;
EOF

# Verificar conexión
if sudo -u postgres psql babyguardian_prod -c "SELECT 1" > /dev/null 2>&1; then
  success "Base de datos PostgreSQL configurada"
else
  error "No se pudo crear la base de datos PostgreSQL"
fi

DATABASE_URL="postgresql://babyguardian:${DB_PASSWORD}@localhost:5432/babyguardian_prod"

# ============================================================================
# PASO 5: GENERAR SECRETS Y CREAR .env
# ============================================================================

log "PASO 5: Generando secrets y configurando variables de entorno..."

JWT_SECRET=$(openssl rand -hex 64)
CAMERA_ENCRYPTION_KEY=$(openssl rand -hex 32)

# Crear archivo .env
cat > /opt/babyguardian/backend/.env <<EOF
# =============================================================================
# BabyGuardian Backend - Configuración de Producción
# Generado automáticamente el $(date)
# =============================================================================

NODE_ENV=production
PORT=3000

# Base de datos
DATABASE_URL=$DATABASE_URL

# JWT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# CORS - Permite cualquier origen (para app local)
CORS_ORIGINS=*

# Auth (desactivado en producción)
AUTH_DEV_BYPASS=false
AUTH_DEV_BYPASS_USER_ID=

# Google OAuth (completar si usas)
GOOGLE_CLIENT_ID=

# Firebase Cloud Messaging (completar si usas)
FCM_SERVER_KEY=

# Cifrado de cámaras
CAMERA_ENCRYPTION_KEY=$CAMERA_ENCRYPTION_KEY

# IA - Configura al menos uno
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-70b-versatile

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-5-haiku-20241022
EOF

chmod 600 /opt/babyguardian/backend/.env
chown babyguardian:babyguardian /opt/babyguardian/backend/.env

success "Variables de entorno configuradas"

# ============================================================================
# PASO 6: INSTALAR DEPENDENCIAS Y BUILD
# ============================================================================

log "PASO 6: Instalando dependencias de npm y compilando..."

cd /opt/babyguardian/backend

sudo -u babyguardian bash -c "
  npm ci --omit=dev > /dev/null 2>&1
  npm run build > /dev/null 2>&1
"

if [ -d "/opt/babyguardian/backend/dist" ]; then
  success "Build completado"
else
  error "Error durante el build de NestJS"
fi

# ============================================================================
# PASO 7: CREAR SERVICIO SYSTEMD
# ============================================================================

log "PASO 7: Creando servicio systemd..."

cat > /etc/systemd/system/babyguardian-backend.service <<EOF
[Unit]
Description=BabyGuardian Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=babyguardian
WorkingDirectory=/opt/babyguardian/backend
EnvironmentFile=/opt/babyguardian/backend/.env
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=babyguardian-backend

# Hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/opt/babyguardian/backend

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable babyguardian-backend

success "Servicio systemd creado"

# ============================================================================
# PASO 8: INICIAR SERVICIO Y ESPERAR HEALTHCHECK
# ============================================================================

log "PASO 8: Iniciando servicio backend..."

systemctl start babyguardian-backend

# Esperar a que el servicio esté listo (máx 30 segundos)
MAX_WAIT=30
WAIT_TIME=0

while [ $WAIT_TIME -lt $MAX_WAIT ]; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    HEALTH=$(curl -s http://localhost:3000/health)
    success "Backend levantado: $HEALTH"
    break
  fi
  WAIT_TIME=$((WAIT_TIME + 2))
  sleep 2
done

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
  error "El backend no respondió en el tiempo esperado. Revisa los logs:"
  echo "  journalctl -u babyguardian-backend -n 50"
  exit 1
fi

# ============================================================================
# PASO 9: CONFIGURAR NGINX
# ============================================================================

log "PASO 9: Configurando nginx..."

# Crear configuración de nginx
cat > /etc/nginx/sites-available/babyguardian <<'NGINX_CONFIG'
upstream babyguardian_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER;

    location / {
        proxy_pass http://babyguardian_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Para CORS desde app local
        proxy_pass_header Access-Control-Allow-Origin;
        proxy_pass_header Access-Control-Allow-Methods;
        proxy_pass_header Access-Control-Allow-Headers;
    }

    # Rate limiting
    location /api/auth/ {
        limit_req zone=api_limit burst=10 nodelay;
        proxy_pass http://babyguardian_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;
NGINX_CONFIG

# Reemplazar dominio en la configuración
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/babyguardian

# Habilitar sitio
ln -sf /etc/nginx/sites-available/babyguardian /etc/nginx/sites-enabled/babyguardian 2>/dev/null || true

# Remover default
rm -f /etc/nginx/sites-enabled/default

# Validar configuración nginx
if nginx -t > /dev/null 2>&1; then
  systemctl reload nginx
  success "Nginx configurado"
else
  error "Error en configuración de nginx"
fi

# ============================================================================
# PASO 10: OBTENER CERTIFICADO SSL
# ============================================================================

log "PASO 10: Obteniendo certificado SSL con Let's Encrypt..."

# Esperar a que nginx esté listo
sleep 2

if certbot certonly --nginx -d "$DOMAIN" \
  --non-interactive --agree-tos \
  --email "$EMAIL" --redirect \
  > /dev/null 2>&1; then
  success "Certificado SSL obtenido para $DOMAIN"
  systemctl reload nginx
else
  warning "No se pudo obtener certificado SSL automáticamente"
  echo ""
  echo "Intenta manualmente:"
  echo "  certbot certonly --nginx -d $DOMAIN --agree-tos --email $EMAIL"
fi

# ============================================================================
# PASO 11: VERIFICACIÓN FINAL
# ============================================================================

log "PASO 11: Realizando verificación final..."

echo ""
echo -e "${BLUE}Pruebas de conectividad:${NC}"
echo ""

# Test 1: Healthcheck local
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
  success "GET http://localhost:3000/health"
else
  warning "GET http://localhost:3000/health - no respondió"
fi

# Test 2: Nginx local
if curl -s http://localhost/ > /dev/null 2>&1; then
  success "Nginx proxy local"
else
  warning "Nginx proxy local - no respondió"
fi

# Test 3: HTTPS (si el certificado se obtuvo)
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  if curl -s https://$DOMAIN/health > /dev/null 2>&1; then
    success "GET https://$DOMAIN/health"
  else
    warning "GET https://$DOMAIN/health - verifica DNS"
  fi
else
  warning "Certificado SSL aún no disponible (DNS puede no apuntar al VPS)"
fi

# ============================================================================
# RESUMEN FINAL
# ============================================================================

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ DESPLIEGUE COMPLETADO EXITOSAMENTE                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}Información de la instalación:${NC}"
echo "  Dominio: $DOMAIN"
echo "  Backend: /opt/babyguardian/backend"
echo "  Base de datos: babyguardian_prod (PostgreSQL)"
echo "  Servicio: babyguardian-backend (systemd)"
echo ""

echo -e "${BLUE}URLs de acceso:${NC}"
echo "  HTTP:  http://$DOMAIN"
echo "  HTTPS: https://$DOMAIN"
echo "  API:   https://$DOMAIN/api/v1"
echo "  Swagger: https://$DOMAIN/api/docs"
echo "  Health: https://$DOMAIN/health"
echo ""

echo -e "${BLUE}Comandos útiles:${NC}"
echo "  Ver logs:           journalctl -u babyguardian-backend -f"
echo "  Reiniciar:          systemctl restart babyguardian-backend"
echo "  Estado:             systemctl status babyguardian-backend"
echo "  Ver variables env:  cat /opt/babyguardian/backend/.env | grep -v '^#'"
echo ""

echo -e "${YELLOW}Próximos pasos:${NC}"
echo "  1. Configura las APIs opcionales en /opt/babyguardian/backend/.env:"
echo "     - GROQ_API_KEY (AI rápido y gratuito)"
echo "     - GOOGLE_CLIENT_ID (OAuth)"
echo "     - FCM_SERVER_KEY (notificaciones push)"
echo ""
echo "  2. Después de cambiar .env, reinicia el servicio:"
echo "     systemctl restart babyguardian-backend"
echo ""
echo "  3. Verifica que DNS apunta correctamente:"
echo "     dig $DOMAIN"
echo ""
echo "  4. Desde tu app local, conecta a: https://$DOMAIN"
echo ""

log "¡Despliegue completado!"
