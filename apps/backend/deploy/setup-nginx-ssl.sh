#!/bin/bash

################################################################################
# BabyGuardian - Configurar Nginx + SSL
#
# Usa: bash setup-nginx-ssl.sh babyguardian.golinkia.com contacto@golinkia.com
################################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Verificar argumentos
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Uso: bash setup-nginx-ssl.sh <dominio> <email>"
  echo "Ejemplo: bash setup-nginx-ssl.sh babyguardian.golinkia.com contacto@golinkia.com"
  exit 1
fi

DOMAIN=$1
EMAIL=$2

if [[ $EUID -ne 0 ]]; then
  error "Este script debe ejecutarse como root"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Configuración de Nginx + SSL para BabyGuardian             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

log "Dominio: $DOMAIN"
log "Email: $EMAIL"
echo ""

# ============================================================================
# PASO 1: INSTALAR NGINX Y CERTBOT SI NO EXISTEN
# ============================================================================

log "PASO 1: Verificando e instalando nginx y certbot..."

if ! command -v nginx &> /dev/null; then
  log "Instalando nginx..."
  apt-get update > /dev/null 2>&1
  apt-get install -y nginx > /dev/null 2>&1
fi

if ! command -v certbot &> /dev/null; then
  log "Instalando certbot..."
  apt-get update > /dev/null 2>&1
  apt-get install -y certbot python3-certbot-nginx > /dev/null 2>&1
fi

success "Nginx y Certbot listos"

# ============================================================================
# PASO 2: CREAR CONFIGURACIÓN NGINX
# ============================================================================

log "PASO 2: Creando configuración de nginx..."

cat > /etc/nginx/sites-available/babyguardian <<'NGINX_CONFIG'
upstream babyguardian_backend {
    server 127.0.0.1:3000;
    keepalive 32;
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

# HTTPS - Producción
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name DOMAIN_PLACEHOLDER;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/privkey.pem;

    # Configuración SSL segura
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Logging
    access_log /var/log/nginx/babyguardian-access.log;
    error_log /var/log/nginx/babyguardian-error.log;

    # Gzip
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
    gzip_min_length 1000;

    # Proxy al backend
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
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    # Rate limiting para login
    location ~ ^/api/v1/auth/(login|register|refresh) {
        limit_req zone=auth_limit burst=5 nodelay;
        proxy_pass http://babyguardian_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=3r/s;
NGINX_CONFIG

# Reemplazar dominio
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/babyguardian

# Crear directorio para verificación Let's Encrypt
mkdir -p /var/www/certbot

# Habilitar sitio
ln -sf /etc/nginx/sites-available/babyguardian /etc/nginx/sites-enabled/babyguardian 2>/dev/null || true

# Remover default
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Validar sintaxis nginx
if ! nginx -t > /dev/null 2>&1; then
  error "Error en configuración de nginx"
fi

# Recargar nginx (con HTTP primero para Let's Encrypt)
systemctl reload nginx

success "Nginx configurado para HTTP (preparado para SSL)"

# ============================================================================
# PASO 3: VERIFICAR DNS
# ============================================================================

log "PASO 3: Verificando DNS..."

RESOLVED_IP=$(dig +short $DOMAIN | tail -1)

if [ -z "$RESOLVED_IP" ]; then
  echo -e "${YELLOW}⚠${NC} No se pudo resolver $DOMAIN"
  echo "   Verifica que el DNS apunta a tu VPS:"
  echo "   dig $DOMAIN"
  read -p "¿Continuar de todas formas? (s/n): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    exit 1
  fi
else
  success "DNS resuelto: $DOMAIN -> $RESOLVED_IP"
fi

# ============================================================================
# PASO 4: OBTENER CERTIFICADO SSL
# ============================================================================

log "PASO 4: Obteniendo certificado SSL con Let's Encrypt..."
echo "   (Esto puede tomar 30-60 segundos)"

if certbot certonly --nginx \
  -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  --redirect \
  2>&1 | grep -q "Successfully"; then

  success "Certificado SSL obtenido exitosamente"

  # Actualizar configuración nginx con rutas reales de certificado
  systemctl reload nginx

  success "Nginx configurado con SSL"
else
  error "No se pudo obtener el certificado. Verifica:"
  echo "  - DNS apunta correctamente a este VPS"
  echo "  - Puerto 80 está abierto"
  echo "  - El dominio es válido"
  exit 1
fi

# ============================================================================
# PASO 5: VERIFICACIÓN FINAL
# ============================================================================

log "PASO 5: Realizando verificación final..."

sleep 2

echo ""
echo -e "${BLUE}Pruebas:${NC}"
echo ""

# Test HTTP redirige a HTTPS
if curl -s -I http://$DOMAIN 2>/dev/null | grep -q "301\|302\|308"; then
  success "HTTP redirige a HTTPS"
else
  echo -e "${YELLOW}⚠${NC} HTTP no redirige a HTTPS (continuando...)"
fi

# Test HTTPS
if curl -s -I https://$DOMAIN 2>/dev/null | grep -q "200\|404"; then
  success "HTTPS funciona"
else
  echo -e "${YELLOW}⚠${NC} HTTPS no responde (verifica que el backend está corriendo)"
fi

# Test backend health
if curl -s https://$DOMAIN/health 2>/dev/null | grep -q "status"; then
  HEALTH=$(curl -s https://$DOMAIN/health)
  success "Backend respondiendo: $HEALTH"
else
  echo -e "${YELLOW}⚠${NC} Backend no responde en /health"
  echo "   Verifica que el servicio está corriendo:"
  echo "   systemctl status babyguardian-backend"
fi

# ============================================================================
# RESUMEN
# ============================================================================

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ NGINX + SSL CONFIGURADO EXITOSAMENTE                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}URLs de acceso:${NC}"
echo "  🔒 HTTPS: https://$DOMAIN"
echo "  📊 Health: https://$DOMAIN/health"
echo "  🔌 API: https://$DOMAIN/api/v1"
echo "  📖 Swagger: https://$DOMAIN/api/docs"
echo ""

echo -e "${BLUE}Certificado SSL:${NC}"
echo "  Ubicación: /etc/letsencrypt/live/$DOMAIN/"
echo "  Renovación automática: Habilitada (certbot)"
echo ""

echo -e "${BLUE}Logs y comandos útiles:${NC}"
echo "  Ver logs nginx:       tail -f /var/log/nginx/babyguardian-error.log"
echo "  Probar nginx:         nginx -t"
echo "  Recargar nginx:       systemctl reload nginx"
echo "  Ver certificado:      certbot certificates"
echo "  Renovar certificados: certbot renew --dry-run"
echo ""

log "¡Configuración completada!"
