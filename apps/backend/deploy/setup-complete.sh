#!/bin/bash

################################################################################
# BabyGuardian Backend - Setup Completo en VPS
#
# Configura:
# 1. Nginx con validación de hash (solo apps autorizadas)
# 2. SSL Let's Encrypt (certificado automático)
# 3. Backend como servicio systemd
# 4. PostgreSQL
# 5. Monitoreo y logs
#
# Uso: sudo bash setup-complete.sh
#
# Requirements:
# - Ubuntu/Debian 20+
# - Acceso root
# - Dominio apuntando a este VPS
################################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Funciones de logging
log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
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
echo -e "${BLUE}║  BabyGuardian Backend - Setup VPS Completo con Hash        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar que se ejecuta como root
if [[ $EUID -ne 0 ]]; then
  error "Este script debe ejecutarse como root (usa: sudo bash setup-complete.sh)"
fi

# ============================================================================
# PASO 0: RECOPILAR INFORMACIÓN
# ============================================================================

log "Recopilando información necesaria..."
echo ""

# Dominio
read -p "Dominio (ej: babyguardian.golinkia.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
  error "El dominio es obligatorio"
fi

# Email para SSL
read -p "Email para certificado SSL (ej: admin@golinkia.com): " EMAIL
if [ -z "$EMAIL" ]; then
  error "El email es obligatorio"
fi

# Hash para autenticación
read -p "Hash para acceso de app (32 chars hex, ej: 7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d): " APP_HASH
if [ -z "$APP_HASH" ] || [ ${#APP_HASH} -ne 32 ]; then
  error "El hash debe tener exactamente 32 caracteres hexadecimales"
fi

# Ruta del backend
BACKEND_PATH="${1:-.}"
BACKEND_PATH="$(cd "$BACKEND_PATH" && pwd)"
if [ ! -f "$BACKEND_PATH/package.json" ]; then
  error "No se encontró package.json en $BACKEND_PATH"
fi

success "Configuración inicial completada"
echo ""

# ============================================================================
# PASO 1: ACTUALIZAR SISTEMA E INSTALAR DEPENDENCIAS
# ============================================================================

log "PASO 1: Instalando dependencias del sistema..."

apt-get update > /dev/null 2>&1 || true

# Instalar paquetes esenciales
PACKAGES="git curl wget nginx certbot python3-certbot-nginx postgresql postgresql-contrib \
          nodejs npm build-essential openssl dnsutils"

for pkg in $PACKAGES; do
  if ! dpkg -l | grep -q "^ii  $pkg"; then
    log "  Instalando $pkg..."
    apt-get install -y "$pkg" > /dev/null 2>&1
  fi
done

# Verificar versiones
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
success "Dependencias instaladas (Node $NODE_VERSION, npm $NPM_VERSION)"

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
mkdir -p /var/www/certbot
chown -R babyguardian:babyguardian /opt/babyguardian

success "Directorios creados"

# ============================================================================
# PASO 3: COPIAR CÓDIGO DEL BACKEND
# ============================================================================

log "PASO 3: Copiando código del backend..."

cp -r "$BACKEND_PATH"/* /opt/babyguardian/backend/ 2>/dev/null || true
cp -r "$BACKEND_PATH"/.[^.]* /opt/babyguardian/backend/ 2>/dev/null || true
chown -R babyguardian:babyguardian /opt/babyguardian/backend

success "Código copiado a /opt/babyguardian/backend/"

# ============================================================================
# PASO 4: GENERAR SECRETS Y CREAR .env
# ============================================================================

log "PASO 4: Generando variables de entorno..."

JWT_SECRET=$(openssl rand -hex 64)
CAMERA_ENCRYPTION_KEY=$(openssl rand -hex 32)

cat > /opt/babyguardian/backend/.env <<EOF
# BabyGuardian - Configuración de Producción
# Generado automáticamente el $(date)

NODE_ENV=production
PORT=3000

# JWT
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGINS=$DOMAIN

# Database (configurar después de crear la DB)
DATABASE_URL=postgresql://babyguardian:CHANGE_ME@localhost:5432/babyguardian_prod

# Auth
AUTH_DEV_BYPASS=false

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=

# Firebase Cloud Messaging (opcional)
FCM_SERVER_KEY=

# Cifrado de cámaras
CAMERA_ENCRYPTION_KEY=$CAMERA_ENCRYPTION_KEY

# IA - Groq (rápido y gratuito)
GROQ_API_KEY=
GROQ_MODEL=llama-3.1-70b-versatile

# IA - OpenAI (opcional)
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

# IA - Anthropic (opcional)
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-5-haiku-20241022
EOF

chmod 600 /opt/babyguardian/backend/.env
chown babyguardian:babyguardian /opt/babyguardian/backend/.env

success "Variables de entorno configuradas"

# ============================================================================
# PASO 5: INSTALAR DEPENDENCIAS Y BUILD
# ============================================================================

log "PASO 5: Instalando dependencias npm y compilando..."

cd /opt/babyguardian/backend

sudo -u babyguardian bash -c "
  npm ci --omit=dev > /dev/null 2>&1
  npm run build > /dev/null 2>&1
" || error "Error en npm ci/build"

if [ -d "/opt/babyguardian/backend/dist" ]; then
  success "Build completado exitosamente"
else
  error "Error durante el build"
fi

# ============================================================================
# PASO 6: CONFIGURAR NGINX
# ============================================================================

log "PASO 6: Configurando nginx con validación de hash..."

# Crear configuración de nginx
cat > /etc/nginx/sites-available/babyguardian <<'NGINX_CONFIG'
# Variables de hashes válidos
map $http_x_app_hash $app_hash_valid {
    default 0;
    HASH_PLACEHOLDER 1;
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS - Servidor principal
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name DOMAIN_PLACEHOLDER;

    # Certificados SSL
    ssl_certificate /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/privkey.pem;

    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5:!3DES;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/babyguardian-access.log combined;
    error_log /var/log/nginx/babyguardian-error.log warn;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Rutas públicas (sin requierir hash)
    location ~ ^/(health|api/docs|api-json)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Rutas privadas (requieren hash válido)
    location / {
        if ($app_hash_valid = 0) {
            return 401;
        }

        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-App-Hash $http_x_app_hash;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    error_page 401 =401 @error_401;
    location @error_401 {
        default_type application/json;
        return 401 '{"error": "Invalid or missing X-App-Hash", "code": "UNAUTHORIZED"}';
    }
}

limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=3r/s;
NGINX_CONFIG

# Reemplazar placeholders
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/babyguardian
sed -i "s/HASH_PLACEHOLDER/$APP_HASH/g" /etc/nginx/sites-available/babyguardian

# Habilitar sitio
ln -sf /etc/nginx/sites-available/babyguardian /etc/nginx/sites-enabled/babyguardian 2>/dev/null || true
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Validar nginx
if ! nginx -t > /dev/null 2>&1; then
  error "Error en configuración de nginx"
fi

systemctl reload nginx
success "Nginx configurado y recargado"

# ============================================================================
# PASO 7: OBTENER CERTIFICADO SSL
# ============================================================================

log "PASO 7: Obteniendo certificado SSL con Let's Encrypt..."
log "   (Verifica que el DNS apunta a este VPS antes de continuar)"

RESOLVED_IP=$(dig +short $DOMAIN | tail -1)
if [ -z "$RESOLVED_IP" ]; then
  warning "No se pudo resolver $DOMAIN"
  echo "   Verifica que el DNS está correctamente configurado:"
  echo "   dig $DOMAIN"
  read -p "¿Continuar de todas formas? (s/n): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    exit 1
  fi
else
  success "DNS resuelto: $DOMAIN -> $RESOLVED_IP"
fi

# Obtener certificado
if certbot certonly --nginx \
  -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  2>&1; then

  success "Certificado SSL obtenido exitosamente"
  systemctl reload nginx
else
  warning "No se pudo obtener certificado SSL automáticamente"
  echo "   Intenta manualmente:"
  echo "   certbot certonly --nginx -d $DOMAIN --agree-tos --email $EMAIL"
fi

# ============================================================================
# PASO 8: CREAR SERVICIO SYSTEMD
# ============================================================================

log "PASO 8: Creando servicio systemd..."

cat > /etc/systemd/system/babyguardian-backend.service <<'SYSTEMD_CONFIG'
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
SYSTEMD_CONFIG

systemctl daemon-reload
systemctl enable babyguardian-backend

success "Servicio systemd creado"

# ============================================================================
# PASO 9: INICIAR SERVICIO
# ============================================================================

log "PASO 9: Iniciando servicio backend..."

systemctl start babyguardian-backend

# Esperar a que esté listo
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
  warning "El backend tardó más de lo esperado en levantarse"
  echo "   Ver logs: journalctl -u babyguardian-backend -n 50"
fi

# ============================================================================
# PASO 10: VERIFICACIÓN FINAL
# ============================================================================

log "PASO 10: Realizando verificaciones finales..."

echo ""
echo -e "${BLUE}Pruebas:${NC}"
echo ""

# Health check público
if curl -s https://$DOMAIN/health > /dev/null 2>&1; then
  success "GET https://$DOMAIN/health ✓"
else
  warning "Health check no respondió (DNS puede no estar actualizado)"
fi

# Test con hash incorrecto (debe fallar)
RESPONSE=$(curl -s -w "\n%{http_code}" https://$DOMAIN/api/v1 -H "X-App-Hash: invalid" 2>/dev/null | tail -1)
if [ "$RESPONSE" = "401" ]; then
  success "Validación de hash: rechaza requests sin hash válido ✓"
else
  warning "Hash validation test - código: $RESPONSE"
fi

# Test con hash correcto
RESPONSE=$(curl -s -w "\n%{http_code}" https://$DOMAIN/api/v1 -H "X-App-Hash: $APP_HASH" 2>/dev/null | tail -1)
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "404" ]; then
  success "Validación de hash: acepta requests con hash válido ✓"
else
  warning "Hash validation test - código: $RESPONSE"
fi

# ============================================================================
# RESUMEN FINAL
# ============================================================================

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ SETUP COMPLETADO EXITOSAMENTE                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}Configuración:${NC}"
echo "  Dominio: $DOMAIN"
echo "  Backend: /opt/babyguardian/backend"
echo "  Hash de app: $APP_HASH"
echo ""

echo -e "${BLUE}URLs de acceso:${NC}"
echo "  HTTPS:   https://$DOMAIN"
echo "  Health:  https://$DOMAIN/health (sin hash)"
echo "  API:     https://$DOMAIN/api/v1 (requiere hash)"
echo "  Swagger: https://$DOMAIN/api/docs"
echo ""

echo -e "${YELLOW}IMPORTANTE - Como enviar el hash desde la app:${NC}"
echo "  Agrega este header a TODOS los requests:"
echo "  X-App-Hash: $APP_HASH"
echo ""
echo "  Ejemplo con curl:"
echo "  curl -H 'X-App-Hash: $APP_HASH' https://$DOMAIN/api/v1"
echo ""

echo -e "${BLUE}Comandos útiles:${NC}"
echo "  Ver logs:           journalctl -u babyguardian-backend -f"
echo "  Reiniciar:          systemctl restart babyguardian-backend"
echo "  Estado:             systemctl status babyguardian-backend"
echo "  Ver nginx:          tail -f /var/log/nginx/babyguardian-error.log"
echo "  Renovar SSL:        certbot renew --dry-run"
echo ""

echo -e "${YELLOW}Próximos pasos:${NC}"
echo "  1. Edita .env con tus claves de API:"
echo "     nano /opt/babyguardian/backend/.env"
echo ""
echo "  2. Agrega el hash en la configuración de tu app"
echo ""
echo "  3. Reinicia el servicio después de cambios:"
echo "     systemctl restart babyguardian-backend"
echo ""

log "¡Setup completado!"
