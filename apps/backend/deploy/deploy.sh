#!/usr/bin/env bash
# =============================================================================
# BabyGuardian Backend - Script de despliegue en VPS (Ubuntu/Debian)
# Dominio: babyguardian.golinkia.com
# Puerto interno: 3000
# Uso: bash deploy.sh
# =============================================================================
set -euo pipefail

DOMAIN="babyguardian.golinkia.com"
APP_DIR="/opt/babyguardian/backend"
APP_USER="babyguardian"
NODE_VERSION="20"
SERVICE_NAME="babyguardian-backend"
REPO_URL="git@github.com:golinkIA/babyguardian.git"   # ajusta si es diferente
BRANCH="master"

echo "==> [1/8] Instalando dependencias del sistema..."
apt-get update -qq
apt-get install -y -qq \
  curl git nginx certbot python3-certbot-nginx \
  build-essential postgresql postgresql-contrib

echo "==> [2/8] Instalando Node.js ${NODE_VERSION}..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
  apt-get install -y nodejs
fi
node --version
npm --version

echo "==> [3/8] Creando usuario y directorio de la app..."
id -u "$APP_USER" &>/dev/null || useradd --system --shell /bin/bash --create-home "$APP_USER"
mkdir -p "$APP_DIR"
chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

echo "==> [4/8] Clonando / actualizando repositorio..."
if [ -d "$APP_DIR/.git" ]; then
  sudo -u "$APP_USER" git -C "$APP_DIR" pull origin "$BRANCH"
else
  sudo -u "$APP_USER" git clone --depth=1 -b "$BRANCH" "$REPO_URL" /tmp/babyguardian_clone
  sudo -u "$APP_USER" cp -r /tmp/babyguardian_clone/apps/backend/. "$APP_DIR/"
  rm -rf /tmp/babyguardian_clone
fi

echo "==> [5/8] Instalando dependencias y compilando..."
sudo -u "$APP_USER" bash -c "cd $APP_DIR && npm ci --omit=dev && npm run build"

echo "==> [6/8] Configurando variables de entorno..."
if [ ! -f "$APP_DIR/.env" ]; then
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  echo "AVISO: Copia creada en $APP_DIR/.env — edita las variables antes de iniciar."
fi

echo "==> [7/8] Configurando nginx..."
bash "$(dirname "$0")/setup-nginx.sh" "$DOMAIN"

echo "==> [8/8] Configurando e iniciando servicio systemd..."
bash "$(dirname "$0")/setup-systemd.sh" "$APP_DIR" "$APP_USER" "$SERVICE_NAME"

echo ""
echo "============================================================"
echo " Despliegue completado."
echo " - App: https://${DOMAIN}/api/v1"
echo " - Docs: https://${DOMAIN}/api/docs"
echo " - Health: https://${DOMAIN}/health"
echo " - Logs: journalctl -u ${SERVICE_NAME} -f"
echo "============================================================"
