#!/bin/sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

DOMAIN="${SSL_DOMAIN:-babyguardian.golinkia.com}"
SSL_DIR="/etc/nginx/ssl"
CERTBOT_DIR="/var/www/certbot"

echo -e "${YELLOW}[SSL Init] Initializing SSL certificates...${NC}"
echo -e "${YELLOW}[SSL Init] Domain: $DOMAIN${NC}"

# Create directories if they don't exist
mkdir -p "$SSL_DIR" "$CERTBOT_DIR"

# Check if certificates already exist
if [ -f "$SSL_DIR/cert.pem" ] && [ -f "$SSL_DIR/key.pem" ]; then
    echo -e "${GREEN}[SSL Init] ✓ Certificates already exist${NC}"
    exit 0
fi

# Check if we're in production (have SSL_EMAIL set)
if [ -z "$SSL_EMAIL" ]; then
    echo -e "${YELLOW}[SSL Init] No SSL_EMAIL provided. Using self-signed certificate for development.${NC}"

    # Generate self-signed certificate
    if [ ! -f "$SSL_DIR/cert.pem" ] || [ ! -f "$SSL_DIR/key.pem" ]; then
        echo -e "${YELLOW}[SSL Init] Generating self-signed certificate...${NC}"
        openssl req -x509 -newkey rsa:4096 -keyout "$SSL_DIR/key.pem" \
            -out "$SSL_DIR/cert.pem" -days 365 -nodes \
            -subj "/CN=$DOMAIN/O=BabyGuardian/C=US"
        echo -e "${GREEN}[SSL Init] ✓ Self-signed certificate generated${NC}"
    fi
else
    echo -e "${YELLOW}[SSL Init] Obtaining Let's Encrypt certificate...${NC}"

    # Try to get Let's Encrypt certificate
    certbot certonly \
        --webroot \
        --webroot-path "$CERTBOT_DIR" \
        --email "$SSL_EMAIL" \
        --agree-tos \
        --non-interactive \
        --domain "$DOMAIN" \
        --cert-name babyguardian || {

        echo -e "${RED}[SSL Init] ✗ Failed to obtain Let's Encrypt certificate${NC}"
        echo -e "${YELLOW}[SSL Init] Falling back to self-signed certificate...${NC}"

        openssl req -x509 -newkey rsa:4096 -keyout "$SSL_DIR/key.pem" \
            -out "$SSL_DIR/cert.pem" -days 365 -nodes \
            -subj "/CN=$DOMAIN/O=BabyGuardian/C=US"
        echo -e "${YELLOW}[SSL Init] ⚠ Self-signed certificate generated (renewal needed)${NC}"
    }
fi

# Verify certificates exist
if [ -f "$SSL_DIR/cert.pem" ] && [ -f "$SSL_DIR/key.pem" ]; then
    echo -e "${GREEN}[SSL Init] ✓ SSL initialization completed${NC}"
    echo -e "${GREEN}[SSL Init] Certificate path: $SSL_DIR/cert.pem${NC}"
    echo -e "${GREEN}[SSL Init] Key path: $SSL_DIR/key.pem${NC}"
else
    echo -e "${RED}[SSL Init] ✗ Failed to create SSL certificates${NC}"
    exit 1
fi
