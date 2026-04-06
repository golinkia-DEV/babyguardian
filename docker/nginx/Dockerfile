FROM nginx:1.25-alpine

# Install certbot and dependencies for Let's Encrypt
RUN apk add --no-cache certbot certbot-nginx python3 py3-pip

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary directories
RUN mkdir -p /var/www/certbot /etc/nginx/ssl

# Copy SSL init script
COPY ssl-init.sh /docker-entrypoint.d/ssl-init.sh
RUN chmod +x /docker-entrypoint.d/ssl-init.sh

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
