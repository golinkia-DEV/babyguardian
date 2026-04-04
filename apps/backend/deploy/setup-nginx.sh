#!/usr/bin/env bash
# =============================================================================
# Configura nginx como proxy reverso para BabyGuardian Backend
# Uso: bash setup-nginx.sh babyguardian.golinkia.com
# =============================================================================
set -euo pipefail

DOMAIN="${1:-babyguardian.golinkia.com}"
NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"
BACKEND_PORT=3000

echo "==> Escribiendo configuracion nginx para ${DOMAIN}..."

cat > "$NGINX_CONF" <<NGINX
# BabyGuardian Backend - generado automaticamente
# Dominio: ${DOMAIN}

# Rate limiting global
limit_req_zone \$binary_remote_addr zone=api:10m rate=30r/s;

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    # Para renovacion certbot
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirigir todo lo demas a HTTPS
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};

    # ----- SSL (certbot los completa automaticamente) -----
    ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # ----- Headers de seguridad -----
    add_header X-Frame-Options          "SAMEORIGIN"  always;
    add_header X-Content-Type-Options   "nosniff"     always;
    add_header Referrer-Policy          "no-referrer" always;
    add_header X-XSS-Protection         "1; mode=block" always;

    # ----- Logs -----
    access_log /var/log/nginx/babyguardian_access.log;
    error_log  /var/log/nginx/babyguardian_error.log;

    # ----- Healthcheck (sin rate limit ni auth) -----
    location = /health {
        proxy_pass         http://127.0.0.1:${BACKEND_PORT}/health;
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        access_log         off;
    }

    # ----- Swagger docs -----
    location /api/docs {
        proxy_pass         http://127.0.0.1:${BACKEND_PORT}/api/docs;
        proxy_http_version 1.1;
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }

    # ----- API principal -----
    location /api/ {
        limit_req zone=api burst=50 nodelay;

        proxy_pass         http://127.0.0.1:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade           \$http_upgrade;
        proxy_set_header   Connection        "upgrade";
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;

        # Timeouts generosos para operaciones IA (chat endpoint puede tardar)
        proxy_connect_timeout  60s;
        proxy_send_timeout     120s;
        proxy_read_timeout     120s;

        # Tamano maximo body (subida de imagenes, etc.)
        client_max_body_size 20M;
    }
}
NGINX

# Activar sitio
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/

# Crear directorio para certbot webroot (si no existe)
mkdir -p /var/www/certbot

# Verificar sintaxis nginx
nginx -t

echo "==> nginx configurado. Recargando..."
systemctl reload nginx || systemctl restart nginx

echo "==> Solicitando certificado SSL con Let's Encrypt..."
certbot --nginx -d "$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email admin@golinkia.com \
  --redirect

echo "==> SSL configurado. Recargando nginx con SSL activo..."
systemctl reload nginx

echo "==> nginx listo con SSL en https://${DOMAIN}"
