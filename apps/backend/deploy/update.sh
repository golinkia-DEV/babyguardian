#!/usr/bin/env bash
# =============================================================================
# BabyGuardian Backend - Script de actualizacion (zero-downtime aprox.)
# Uso: bash update.sh [rama]
# =============================================================================
set -euo pipefail

APP_DIR="/opt/babyguardian/backend"
APP_USER="babyguardian"
SERVICE_NAME="babyguardian-backend"
BRANCH="${1:-master}"
REPO_REMOTE="origin"

echo "==> [1/4] Pulling cambios desde ${REPO_REMOTE}/${BRANCH}..."
sudo -u "$APP_USER" git -C "$APP_DIR" fetch "$REPO_REMOTE"
sudo -u "$APP_USER" git -C "$APP_DIR" checkout "$BRANCH"
sudo -u "$APP_USER" git -C "$APP_DIR" pull "$REPO_REMOTE" "$BRANCH"

echo "==> [2/4] Instalando dependencias y compilando..."
sudo -u "$APP_USER" bash -c "cd $APP_DIR && npm ci --omit=dev && npm run build"

echo "==> [3/4] Reiniciando servicio..."
systemctl restart "$SERVICE_NAME"
sleep 3

echo "==> [4/4] Verificando healthcheck..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$HTTP_CODE" = "200" ]; then
  echo "OK - Backend respondiendo (HTTP 200)"
else
  echo "ERROR - Healthcheck devolvio HTTP ${HTTP_CODE}"
  echo "Logs recientes:"
  journalctl -u "$SERVICE_NAME" --no-pager -n 30
  exit 1
fi

echo ""
echo "Actualizacion completada exitosamente."
echo "Logs: journalctl -u ${SERVICE_NAME} -f"
