#!/bin/bash

################################################################################
# BabyGuardian - Script para actualizar hash sin downtime
#
# Uso: sudo bash update-hash.sh <nuevo_hash>
#
# Ejemplo: sudo bash update-hash.sh a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
################################################################################

set -e

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

# Verificar que se ejecuta como root
if [[ $EUID -ne 0 ]]; then
  error "Este script debe ejecutarse como root"
fi

# Verificar argumentos
if [ -z "$1" ]; then
  error "Uso: bash update-hash.sh <nuevo_hash>"
fi

NEW_HASH=$1

# Validar hash (32 caracteres hexadecimales)
if [ ${#NEW_HASH} -ne 32 ] || ! [[ $NEW_HASH =~ ^[0-9a-fA-F]{32}$ ]]; then
  error "El hash debe tener exactamente 32 caracteres hexadecimales"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  BabyGuardian - Actualizar Hash de Acceso                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

log "Nuevo hash: $NEW_HASH"
echo ""

# Obtener hash actual
if [ -f "/etc/nginx/sites-available/babyguardian" ]; then
  OLD_HASH=$(grep -oP '(?<=")[0-9a-fA-F]{32}' /etc/nginx/sites-available/babyguardian | head -1)

  if [ -z "$OLD_HASH" ]; then
    warning "No se encontró hash anterior en la configuración"
  else
    log "Hash anterior: $OLD_HASH"
  fi
fi

echo ""
echo -e "${YELLOW}Acción: Reemplazar hash en nginx${NC}"
echo "  Archivo: /etc/nginx/sites-available/babyguardian"
echo ""

read -p "¿Continuar? (s/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Cancelado."
  exit 0
fi

# Hacer backup
BACKUP_FILE="/etc/nginx/sites-available/babyguardian.backup.$(date +%s)"
cp /etc/nginx/sites-available/babyguardian "$BACKUP_FILE"
success "Backup creado: $BACKUP_FILE"

# Actualizar hash
# Solo reemplazar en la sección del map, no en comentarios
sed -i "s/\"$OLD_HASH\"/\"$NEW_HASH\"/g" /etc/nginx/sites-available/babyguardian

# Validar cambio
if grep -q "$NEW_HASH" /etc/nginx/sites-available/babyguardian; then
  success "Hash actualizado en configuración"
else
  error "No se pudo actualizar el hash"
fi

# Validar sintaxis nginx
log "Validando configuración de nginx..."
if nginx -t > /dev/null 2>&1; then
  success "Configuración válida"
else
  error "Error en configuración de nginx"
fi

# Recargar nginx (sin downtime)
log "Recargando nginx..."
systemctl reload nginx

if systemctl is-active --quiet nginx; then
  success "Nginx recargado exitosamente"
else
  error "Error al recargar nginx"
fi

# Verificar que el nuevo hash funciona
sleep 1
log "Probando nuevo hash..."

RESPONSE=$(curl -s -w "\n%{http_code}" https://localhost/health -H "X-App-Hash: $NEW_HASH" -k 2>/dev/null | tail -1)
if [ "$RESPONSE" = "200" ]; then
  success "Nuevo hash funciona correctamente"
else
  warning "Test de hash: código $RESPONSE"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ HASH ACTUALIZADO EXITOSAMENTE                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}Información:${NC}"
echo "  Hash anterior: ${OLD_HASH:-desconocido}"
echo "  Hash nuevo:    $NEW_HASH"
echo "  Backup:        $BACKUP_FILE"
echo ""

echo -e "${YELLOW}Próximos pasos:${NC}"
echo "  1. Actualiza todas tus apps con el nuevo hash"
echo "  2. Prueba que la app se conecta correctamente"
echo "  3. Verifica los logs:"
echo "     tail -f /var/log/nginx/babyguardian-error.log"
echo ""

log "¡Hash actualizado!"
