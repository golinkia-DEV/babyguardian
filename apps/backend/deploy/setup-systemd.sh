#!/usr/bin/env bash
# =============================================================================
# Configura systemd service para BabyGuardian Backend
# Uso: bash setup-systemd.sh /opt/babyguardian/backend babyguardian babyguardian-backend
# =============================================================================
set -euo pipefail

APP_DIR="${1:-/opt/babyguardian/backend}"
APP_USER="${2:-babyguardian}"
SERVICE_NAME="${3:-babyguardian-backend}"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

echo "==> Escribiendo ${SERVICE_FILE}..."

cat > "$SERVICE_FILE" <<SERVICE
[Unit]
Description=BabyGuardian Backend NestJS API
Documentation=https://babyguardian.golinkia.com/api/docs
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=${APP_USER}
Group=${APP_USER}
WorkingDirectory=${APP_DIR}
EnvironmentFile=${APP_DIR}/.env

# Comando de inicio (dist compilado)
ExecStart=/usr/bin/node ${APP_DIR}/dist/main.js

# Restart automatico en fallos (no en stop manual)
Restart=on-failure
RestartSec=5
StartLimitIntervalSec=60
StartLimitBurst=3

# Seguridad: limitar lo que puede hacer el proceso
NoNewPrivileges=true
ProtectSystem=strict
ReadWritePaths=${APP_DIR}
PrivateTmp=true

# Logs al journal de systemd
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${SERVICE_NAME}

# Dar tiempo al proceso para levantar (NestJS + TypeORM puede tardar)
TimeoutStartSec=30

# Healthcheck interno: si /health no responde, systemd puede reiniciar
# (requiere systemd >= 245; comentar si version es menor)
# ExecStartPost=/usr/bin/curl -sf http://localhost:3000/health

[Install]
WantedBy=multi-user.target
SERVICE

echo "==> Recargando daemon y activando servicio..."
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

# Esperar que levante
sleep 3

echo "==> Estado del servicio:"
systemctl status "$SERVICE_NAME" --no-pager -l

echo ""
echo "Comandos utiles:"
echo "  journalctl -u ${SERVICE_NAME} -f          # logs en tiempo real"
echo "  systemctl restart ${SERVICE_NAME}          # reiniciar"
echo "  systemctl stop ${SERVICE_NAME}             # detener"
echo "  systemctl status ${SERVICE_NAME}           # estado"
