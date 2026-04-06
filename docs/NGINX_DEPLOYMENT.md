# Nginx Reverse Proxy Deployment

## Overview

Tu aplicación BabyGuardian está configurada para exponerse a través de nginx como reverse proxy en:

```
https://babyguardian.golinkia.com/api/v1
```

Nginx actúa como:
- **Reverse proxy** al backend en el puerto 3000
- **SSL/TLS terminator** con soporte para Let's Encrypt
- **Load balancer** con health checks
- **Rate limiter** para proteger contra abuso
- **CORS handler** para requests desde múltiples orígenes

---

## Architecture

```
┌─────────────┐
│   Internet  │
│   HTTPS     │
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│    Nginx (Reverse Proxy)     │
│  babyguardian.golinkia.com   │
│    Port 80, 443 (SSL)        │
└──────────────────────────────┘
       │
       │ HTTP (Internal)
       │ Port 3000
       ▼
┌──────────────────────────────┐
│    Backend (NestJS)          │
│  Port 3000 (Localhost Only)  │
└──────────────────────────────┘
```

---

## Prerequisites

1. **DNS Records**
   ```
   babyguardian.golinkia.com  A  [YOUR_SERVER_IP]
   ```

2. **Server Requirements**
   - Docker and Docker Compose installed
   - Ports 80 and 443 open (for HTTPS)
   - Git repository with code

---

## Installation

### 1. Prepare `.env` File

```bash
cd /root/repos/babyguardian/docker
cp .env.example .env
```

Edit `.env`:

```env
# For production with Let's Encrypt
SSL_DOMAIN=babyguardian.golinkia.com
SSL_EMAIL=your-email@example.com

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Other configurations
NODE_ENV=production
DATABASE_URL=postgresql://babyguardian:babyguardian_secret_2024@postgres:5432/babyguardian
REDIS_URL=redis://redis:6379
```

### 2. Deploy with Docker Compose

```bash
cd /root/repos/babyguardian/docker

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f nginx
```

### 3. Verify Deployment

```bash
# Check nginx is running
docker-compose logs nginx | grep "SSL Init"

# Test API endpoint
curl -k https://babyguardian.golinkia.com/health

# Test login endpoint
curl -X POST https://babyguardian.golinkia.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@babyguardian.local",
    "password": "Admin123!"
  }'
```

---

## SSL/TLS Configuration

### Automatic Let's Encrypt (Production)

Set `SSL_EMAIL` in `.env`:

```env
SSL_EMAIL=admin@yourdomain.com
```

Nginx will automatically:
1. Request a Let's Encrypt certificate
2. Setup automatic renewal (via certbot)
3. Redirect HTTP to HTTPS

### Self-Signed Certificates (Development)

Leave `SSL_EMAIL` empty in `.env`:

```env
SSL_EMAIL=
```

Nginx will generate a self-signed certificate. On mobile apps:

```typescript
// In apiClient.ts (already configured)
httpsAgent: {
  rejectUnauthorized: false,  // Accept self-signed certs
}
```

---

## Nginx Configuration Details

### Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### CORS Headers

Already configured to allow requests from any origin with proper methods and headers.

### Rate Limiting

```
/api/*              → 100 requests/second (burst 200)
/api/auth/login     → 10 requests/second (burst 5)
/api/auth/register  → 10 requests/second (burst 5)
```

### Compression

Gzip enabled for:
- text/plain
- text/css
- application/json
- application/javascript
- images/svg+xml

---

## API Endpoints

All endpoints are accessible at:

```
https://babyguardian.golinkia.com/api/v1/
```

### Examples

#### Login
```bash
curl -X POST https://babyguardian.golinkia.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@babyguardian.local",
    "password": "Admin123!"
  }'
```

#### Get Current User (with token)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://babyguardian.golinkia.com/api/v1/users/me
```

#### Swagger Documentation
```
https://babyguardian.golinkia.com/api/docs
```

---

## Mobile App Configuration

The mobile app is already configured to use this URL:

```typescript
// apps/mobile/src/api/apiClient.ts
const DEFAULT_API_URL = 'https://babyguardian.golinkia.com/api/v1';
```

### Building and Running

```bash
cd apps/mobile

# Install dependencies
npm install

# Run on iOS
npm run ios

# Run on Android
npm run android
```

---

## Database Setup

### Create Test Users

#### Via Docker Container

```bash
# Connect to backend container
docker-compose exec backend bash

# Run seed script
cd /app
npx ts-node src/scripts/seed-test-users.ts
```

#### Via Docker CLI

```bash
docker exec -it babyguardian-backend \
  npx ts-node src/scripts/seed-test-users.ts
```

### Verify Database

```bash
# Check users exist
docker-compose exec postgres \
  psql -U babyguardian -d babyguardian \
  -c "SELECT email, \"fullName\" FROM \"user\";"
```

---

## Monitoring and Logs

### View Real-time Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nginx
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Check Service Health

```bash
# All health checks
docker-compose ps

# Specific health check
curl http://localhost/health
curl http://localhost:3000/health
```

### Nginx Access Logs

```bash
# View nginx logs
docker-compose exec nginx tail -f /var/log/nginx/access.log

# View nginx errors
docker-compose exec nginx tail -f /var/log/nginx/error.log
```

---

## Maintenance

### Update Backend Code

```bash
cd /root/repos/babyguardian

# Pull latest code
git pull

# Rebuild and restart backend
docker-compose up --build -d backend

# Check status
docker-compose logs -f backend
```

### Renew SSL Certificates (Let's Encrypt)

Automatic renewal is handled by certbot in the nginx container. Manual renewal:

```bash
docker-compose exec nginx \
  certbot renew --webroot -w /var/www/certbot/
```

### Database Backup

```bash
# Backup PostgreSQL
docker-compose exec postgres \
  pg_dump -U babyguardian babyguardian > backup_$(date +%Y%m%d).sql

# Restore from backup
docker-compose exec -T postgres \
  psql -U babyguardian babyguardian < backup_20240406.sql
```

### Clear Cache (Redis)

```bash
docker-compose exec redis redis-cli FLUSHALL
```

---

## Troubleshooting

### "Connection refused" to 23.95.140.206

Update your API URL if still pointing to old IP:

```typescript
// apps/mobile/src/api/apiClient.ts
const DEFAULT_API_URL = 'https://babyguardian.golinkia.com/api/v1';
```

### "SSL certificate not trusted"

For development, you can disable certificate verification:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  httpsAgent: {
    rejectUnauthorized: false,  // Development only!
  }
});
```

### Nginx not responding

```bash
# Check if nginx container is running
docker-compose ps nginx

# Check nginx logs
docker-compose logs nginx

# Restart nginx
docker-compose restart nginx

# Rebuild nginx
docker-compose up --build -d nginx
```

### Backend responding but nginx shows 502 Bad Gateway

```bash
# Check backend health
docker-compose logs backend

# Verify backend is running
docker-compose ps backend

# Check if backend is listening on port 3000
docker-compose exec backend netstat -tlnp | grep 3000
```

### "Connection timeout" to database

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check database connection
docker-compose logs postgres

# Verify network connectivity
docker-compose exec backend \
  pg_isready -h postgres -U babyguardian
```

---

## Performance Tuning

### Increase Worker Processes

In `docker/nginx/nginx.conf`:
```nginx
worker_processes 4;  # Adjust based on CPU cores
```

### Adjust Rate Limits

In `docker/nginx/nginx.conf`:
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=200r/s;  # Increase if needed
```

### Enable Caching for Static Content

Add to nginx.conf location block:
```nginx
expires 7d;
add_header Cache-Control "public, immutable";
```

---

## Security Best Practices

1. **Change Default Passwords**
   ```env
   POSTGRES_PASSWORD=your_strong_password_here
   ```

2. **Secure JWT Secret**
   ```bash
   JWT_SECRET=$(openssl rand -base64 32)
   ```

3. **Enable Firewall Rules**
   ```bash
   # Only allow ports 80 and 443
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw deny from any to any port 3000  # Backend only internal
   ufw deny from any to any port 5432  # Database only internal
   ```

4. **Update Docker Images Regularly**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

5. **Monitor SSL Expiration**
   ```bash
   # Check certificate expiration
   openssl x509 -in docker/nginx/ssl/cert.pem -noout -dates
   ```

---

## Deployment Checklist

- [ ] DNS record pointing to server IP
- [ ] `.env` file configured with correct values
- [ ] SSL certificate strategy decided (Let's Encrypt or self-signed)
- [ ] Database initialized with schema
- [ ] Test users created
- [ ] Nginx reverse proxy running
- [ ] Backend responding on https://babyguardian.golinkia.com/api/v1
- [ ] Mobile app configured with new URL
- [ ] Firewall rules configured
- [ ] Backup strategy in place
- [ ] Monitoring and logging configured
- [ ] SSL certificate auto-renewal tested

---

## Next Steps

1. Deploy the stack: `docker-compose up -d`
2. Create test users in the database
3. Test API endpoints
4. Configure mobile app to use the new URL
5. Monitor logs for any issues
6. Setup automated backups
7. Configure monitoring/alerting

---

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review troubleshooting section above
- Check Nginx configuration: `docker/nginx/nginx.conf`
- Review docker-compose: `docker/docker-compose.yml`
