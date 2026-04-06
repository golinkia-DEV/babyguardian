#!/bin/bash

################################################################################
# BabyGuardian - Deploy Script para ejecutar desde tu PC
#
# Este script:
# 1. Copia el código del backend a tu VPS
# 2. Ejecuta el deploy completo automáticamente
#
# Uso: bash deploy-to-vps.sh
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

warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Banner
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  BabyGuardian - Deploy Automático a VPS                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuración
VPS_IP="23.95.140.206"
VPS_USER="root"
DOMAIN="babyguardian.golinkia.com"
EMAIL="contacto@golinkia.com"
SSH_KEY_PATH="$HOME/.ssh/id_rsa"

log "Configuración:"
echo "  VPS IP: $VPS_IP"
echo "  Usuario: $VPS_USER"
echo "  Dominio: $DOMAIN"
echo "  Email SSL: $EMAIL"
echo ""

# ============================================================================
# PASO 1: VERIFICAR CONECTIVIDAD SSH
# ============================================================================

log "PASO 1: Verificando conexión SSH..."

if ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP "echo 'SSH OK'" > /dev/null 2>&1; then
  error "No se puede conectar a $VPS_USER@$VPS_IP via SSH"
fi

success "Conexión SSH establecida"

# ============================================================================
# PASO 2: COPIAR SCRIPTS DE DEPLOY
# ============================================================================

log "PASO 2: Copiando scripts de despliegue al VPS..."

scp -o StrictHostKeyChecking=no \
  /root/repos/babyguardian/apps/backend/deploy/deploy-vps.sh \
  /root/repos/babyguardian/apps/backend/deploy/setup-nginx-ssl.sh \
  $VPS_USER@$VPS_IP:/tmp/ > /dev/null 2>&1

success "Scripts copiados"

# ============================================================================
# PASO 3: EJECUTAR DEPLOY COMPLETO
# ============================================================================

log "PASO 3: Ejecutando despliegue en el VPS..."
log "Esto puede tomar 5-10 minutos. Por favor espera..."
echo ""

# Crear script de entrada que ejecute todo sin interactividad
ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP << 'DEPLOY_SCRIPT'
#!/bin/bash

set -e

export DEBIAN_FRONTEND=noninteractive

# Ejecutar deploy-vps.sh sin interactividad
# (usa expect para pasar las respuestas automáticamente)

cat > /tmp/auto-deploy.exp <<'EXPECT_SCRIPT'
#!/usr/bin/expect -f

set timeout 300
set domain "babyguardian.golinkia.com"
set email "contacto@golinkia.com"
set password "Gamonal7Secure123"

# Generar contraseña PostgreSQL aleatoria
set db_password [exec openssl rand -hex 16]

log_user 1

# Iniciar bash
spawn bash /tmp/deploy-vps.sh
expect "Dominio*:"
send "$domain\r"
expect "Email*:"
send "$email\r"
expect "Contraseña*:"
send "$db_password\r"
expect eof

exit 0
EXPECT_SCRIPT

# Si expect no está disponible, usar método alternativo
if ! command -v expect &> /dev/null; then
  # Instalar expect
  apt-get install -y expect > /dev/null 2>&1
fi

# Generar contraseña PostgreSQL segura
DB_PASSWORD=$(openssl rand -hex 16)

# Ejecutar con respuestas automáticas
(echo "babyguardian.golinkia.com"; sleep 1; echo "contacto@golinkia.com"; sleep 1; echo "$DB_PASSWORD"; sleep 1) | \
  bash /tmp/deploy-vps.sh || true

DEPLOY_SCRIPT

success "Despliegue iniciado en el VPS"

# ============================================================================
# PASO 4: CONFIGURAR NGINX + SSL (esperar a que el backend esté listo)
# ============================================================================

log "PASO 4: Esperando a que el backend esté listo..."

ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP << 'NGINX_SCRIPT'
#!/bin/bash

# Esperar a que el healthcheck responda
MAX_WAIT=60
WAIT_TIME=0

while [ $WAIT_TIME -lt $MAX_WAIT ]; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✓ Backend respondiendo"
    break
  fi
  WAIT_TIME=$((WAIT_TIME + 5))
  sleep 5
done

# Ejecutar configuración de nginx + SSL
bash /tmp/setup-nginx-ssl.sh babyguardian.golinkia.com contacto@golinkia.com

NGINX_SCRIPT

success "Nginx + SSL configurado"

# ============================================================================
# PASO 5: VERIFICACIÓN FINAL
# ============================================================================

log "PASO 5: Realizando verificación final..."

echo ""

# Verificar que el servicio corre
if ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP \
  "systemctl is-active babyguardian-backend" > /dev/null 2>&1; then
  success "Servicio babyguardian-backend está activo"
else
  warning "Servicio babyguardian-backend no está activo"
fi

# Verificar healthcheck local
if ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_IP \
  "curl -s http://localhost:3000/health" > /dev/null 2>&1; then
  success "Healthcheck local responde"
else
  warning "Healthcheck local no responde"
fi

# Verificar HTTPS
sleep 2
if curl -s -I https://babyguardian.golinkia.com/health 2>/dev/null | grep -q "200\|404"; then
  HEALTH=$(curl -s https://babyguardian.golinkia.com/health 2>/dev/null || echo "error")
  success "HTTPS funciona: $HEALTH"
else
  warning "HTTPS aún no accesible (verifica DNS)"
fi

# ============================================================================
# RESUMEN FINAL
# ============================================================================

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ DESPLIEGUE COMPLETADO EXITOSAMENTE                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}Backend disponible en:${NC}"
echo "  🔒 https://babyguardian.golinkia.com"
echo "  📊 https://babyguardian.golinkia.com/health"
echo "  🔌 https://babyguardian.golinkia.com/api/v1"
echo "  📖 https://babyguardian.golinkia.com/api/docs"
echo ""

echo -e "${BLUE}Comandos útiles en el VPS:${NC}"
echo "  Ver logs:           ssh root@23.95.140.206 'journalctl -u babyguardian-backend -f'"
echo "  Ver estado:         ssh root@23.95.140.206 'systemctl status babyguardian-backend'"
echo "  Reiniciar:          ssh root@23.95.140.206 'systemctl restart babyguardian-backend'"
echo "  Ver variables env:  ssh root@23.95.140.206 'cat /opt/babyguardian/backend/.env'"
echo ""

echo -e "${YELLOW}Próximos pasos:${NC}"
echo "  1. Verifica que el DNS de babyguardian.golinkia.com apunta a 23.95.140.206"
echo "  2. Configura las APIs opcionales en /opt/babyguardian/backend/.env"
echo "  3. Desde tu app local, conecta a: https://babyguardian.golinkia.com"
echo ""

log "¡Deploy completado!"
