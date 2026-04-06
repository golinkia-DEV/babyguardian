# 🚀 Quick Start - Deploy con Nginx

## ✅ Configuración Completada

1. **Nginx reverse proxy** configurado para `https://babyguardian.golinkia.com/api/v1`
2. **SSL/TLS** con soporte para Let's Encrypt
3. **Rate limiting** en endpoints de autenticación
4. **CORS headers** habilitados
5. **Health checks** en todos los servicios
6. **Docker Compose** con red interna

---

## 🚀 Deploy en 3 pasos

### Paso 1: Configurar `.env`

```bash
cd docker
cp .env.example .env
```

Editar `docker/.env`:

```env
# SSL Configuration
SSL_DOMAIN=babyguardian.golinkia.com
SSL_EMAIL=tu-email@example.com    # Para Let's Encrypt (dejar vacío para self-signed)

# Database
DATABASE_URL=postgresql://babyguardian:babyguardian_secret_2024@postgres:5432/babyguardian

# JWT Secret (generar uno nuevo)
JWT_SECRET=$(openssl rand -base64 32)

# Otros servicios (opcional)
GOOGLE_CLIENT_ID=your-google-id
FCM_SERVER_KEY=your-fcm-key
```

### Paso 2: Levantar servicios

```bash
cd docker
docker-compose up -d

# Esperar a que todo esté listo (2-3 min)
docker-compose logs nginx | grep "SSL Init"
```

### Paso 3: Crear usuarios de prueba

```bash
# Dentro del contenedor backend
docker-compose exec backend bash
cd /app
npx ts-node src/scripts/seed-test-users.ts

# O sin entrar al contenedor:
docker exec -it babyguardian-backend \
  npx ts-node src/scripts/seed-test-users.ts
```

---

## ✅ Verificar que funciona

```bash
# Health check
curl https://babyguardian.golinkia.com/health

# Test login
curl -X POST https://babyguardian.golinkia.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@babyguardian.local",
    "password": "Admin123!"
  }'
```

---

## 📱 App Móvil

La app móvil **ya está configurada** para usar:
```
https://babyguardian.golinkia.com/api/v1
```

Solo construir y correr:

```bash
cd apps/mobile
npm install
npm run ios    # o android
```

Login con:
```
Email:    admin@babyguardian.local
Password: Admin123!
```

---

## 📊 Servicios en Docker

| Servicio | Container | Puerto | Red |
|----------|-----------|--------|-----|
| **Nginx** | babyguardian-nginx | 80, 443 | Pública |
| **Backend** | babyguardian-backend | 3000 | Interna |
| **PostgreSQL** | babyguardian-postgres | 5432 | Interna |
| **Redis** | babyguardian-redis | 6379 | Interna |

---

## 📋 Comandos Útiles

```bash
# Ver estado
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f nginx

# Reiniciar un servicio
docker-compose restart backend

# Parar todo
docker-compose down

# Reconstruir y reiniciar
docker-compose up --build -d

# Entrar a un contenedor
docker-compose exec backend bash
```

---

## 🔐 Usuarios de Prueba

```
Email:    admin@babyguardian.local
Password: Admin123!

Email:    parent1@babyguardian.local
Password: Parent123!

Email:    parent2@babyguardian.local
Password: Parent123!

Email:    guardian@babyguardian.local
Password: Guardian123!
```

---

## 🚨 Troubleshooting

### Nginx no levanta
```bash
docker-compose logs nginx
# Verificar que el domain sea correcto en .env
```

### Backend no responde
```bash
docker-compose logs backend
docker-compose ps backend  # Verificar si está running
```

### Certificado SSL no válido (development)
```bash
# Es normal si SSL_EMAIL está vacío
# Los navegadores/apps puede que den advertencia
# En producción, usar email válido para Let's Encrypt
```

### "Connection refused"
```bash
# Esperar a que todo esté listo (2-3 minutos)
docker-compose logs
```

---

## 📚 Documentación Completa

- **`docs/NGINX_DEPLOYMENT.md`** - Guía completa de Nginx
- **`docs/MOBILE_APP_SETUP.md`** - Setup de la app móvil
- **`docs/CREATE_TEST_USERS.md`** - Crear más usuarios

---

## 🎯 Arquitectura

```
Internet (HTTPS)
    ↓
Nginx (Reverse Proxy)
    ↓ (HTTP interno)
Backend (NestJS)
    ↓
PostgreSQL
    ↓
Redis
```

---

## ✨ Lo que ya está configurado

✅ Nginx como reverse proxy  
✅ SSL/TLS con certificados  
✅ Rate limiting  
✅ CORS habilitado  
✅ Health checks  
✅ Logs centralizados  
✅ Variables de entorno  
✅ Red interna Docker  
✅ Persistencia de datos (volumes)  

---

## 🚀 Próximos pasos

1. Asegurar que `babyguardian.golinkia.com` apunte al servidor
2. Configurar `.env` con tus valores
3. Levantar `docker-compose up -d`
4. Crear usuarios de prueba
5. Verificar endpoints
6. Construir app móvil
7. ¡Listo!

---

**¿Necesitas ayuda?** Revisa los logs:
```bash
docker-compose logs -f
```
