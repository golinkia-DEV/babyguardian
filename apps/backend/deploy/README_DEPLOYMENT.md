# 🚀 BabyGuardian Backend - Deployment Guide

Guía completa para desplegar el backend de BabyGuardian en un VPS con autenticación por hash.

## 📦 Archivos Incluidos

| Archivo | Descripción |
|---------|-------------|
| **setup-complete.sh** | Script principal de instalación automática |
| **update-hash.sh** | Script para cambiar el hash sin downtime |
| **nginx-with-hash.conf** | Configuración de nginx con validación de hash |
| **SETUP_VPS.md** | Guía paso a paso de instalación |
| **HASH_AUTHENTICATION.md** | Cómo integrar el hash en tu app |
| **.env.production.template** | Template de variables de entorno |

## ⚡ Inicio Rápido (3 pasos)

### 1. Generar Hash

```bash
# En tu máquina
openssl rand -hex 16

# Anotar el resultado (32 caracteres)
# Ej: 7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d
```

### 2. Ejecutar Setup en VPS

```bash
# SSH a tu VPS
ssh root@23.95.140.206

# Clonar el repo y ejecutar script
git clone https://github.com/tu-repo/babyguardian.git
cd babyguardian/apps/backend/deploy
sudo bash setup-complete.sh

# Responder las preguntas:
# - Dominio: babyguardian.golinkia.com
# - Email: admin@golinkia.com  
# - Hash: [tu hash de 32 caracteres]
```

### 3. Configurar App

Agregar el hash a tu app (ver [HASH_AUTHENTICATION.md](./HASH_AUTHENTICATION.md)):

```javascript
// Para React
const API_HASH = '7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d';

client.interceptors.request.use((config) => {
  config.headers['X-App-Hash'] = API_HASH;
  return config;
});
```

---

## 🔐 Cómo Funciona la Autenticación por Hash

```
App (con hash correcto)
        ↓
    HTTPS Request con header:
    X-App-Hash: 7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d
        ↓
    Nginx valida el hash
        ✓ PERMITIDO ✗ RECHAZADO
        ↓
    Proxy a Backend (puerto 3000)
        ↓
    Respuesta a la app
```

---

## 📋 Checklist Pre-Deployment

- [ ] Generar hash de 32 caracteres: `openssl rand -hex 16`
- [ ] DNS apuntando a VPS (23.95.140.206)
- [ ] Acceso SSH a VPS como root
- [ ] Email para certificado SSL Let's Encrypt
- [ ] Node.js 20+ instalado (opcional, se instala automáticamente)

---

## 🎯 Qué hace el Script de Setup

El script `setup-complete.sh` automatiza:

1. **Instalación de dependencias**
   - Node.js 20 LTS
   - Nginx
   - PostgreSQL
   - Certbot

2. **Configuración de Backend**
   - Crear usuario `babyguardian`
   - Crear directorios en `/opt/babyguardian/backend`
   - Copiar código
   - Instalar npm packages
   - Compilar TypeScript

3. **Configuración de Base de Datos**
   - Crear usuario PostgreSQL
   - Crear base de datos `babyguardian_prod`

4. **Configuración de Nginx**
   - Setup con validación de hash
   - Redirigir HTTP → HTTPS
   - Rate limiting
   - Gzip compression
   - Headers de seguridad

5. **Certificado SSL**
   - Obtener de Let's Encrypt automáticamente
   - Configurar renovación automática con certbot

6. **Servicio Systemd**
   - Backend como servicio `babyguardian-backend`
   - Auto-restart en caso de crash
   - Logging con journalctl

---

## 📚 Documentación Detallada

### Para administradores del servidor:
👉 **[SETUP_VPS.md](./SETUP_VPS.md)**
- Instalación paso a paso
- Troubleshooting
- Comandos útiles
- Monitoreo

### Para desarrolladores de la app:
👉 **[HASH_AUTHENTICATION.md](./HASH_AUTHENTICATION.md)**
- Cómo enviar el hash desde:
  - React / React Native
  - Vue / Angular / Web
  - Flutter
  - Swift (iOS)
  - Kotlin (Android)
- Cambiar hash
- Seguridad

---

## 🌐 URLs de Acceso

```
HTTPS:  https://babyguardian.golinkia.com
API:    https://babyguardian.golinkia.com/api/v1
Swagger: https://babyguardian.golinkia.com/api/docs
Health: https://babyguardian.golinkia.com/health (sin hash)
```

---

## 🔄 Workflow de Despliegue

### Despliegue inicial
```bash
bash setup-complete.sh
# ↓
# Instala todo automáticamente
# ↓
Backend disponible en https://babyguardian.golinkia.com
```

### Cambiar hash
```bash
bash update-hash.sh <nuevo_hash>
# ↓
# Actualiza nginx sin downtime
# ↓
Actualizar hash en todas las apps
```

### Actualizar backend (nuevo deployment)
```bash
cd /opt/babyguardian/backend
git pull origin main
npm ci --omit=dev
npm run build
systemctl restart babyguardian-backend
```

---

## 🛡️ Seguridad

### Hash en Producción

- ✅ Usar hash **único y aleatorio** de 32 caracteres
- ✅ Cambiar hash si se expone
- ✅ Usar **HTTPS siempre** (se fuerza automáticamente)
- ✅ Considerar cambiar hash **periódicamente** (ej: cada 3 meses)

### Nginx Headers de Seguridad (incluidos)

- ✅ HSTS (HTTP Strict Transport Security)
- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy

### Protecciones (incluidas)

- ✅ Rate limiting en `/auth/*`
- ✅ SSL/TLS 1.2+
- ✅ CORS restrictivo
- ✅ Gzip compression

---

## 📊 Estructura de Directorios

```
/opt/babyguardian/
├── backend/
│   ├── dist/              # Código compilado
│   ├── src/               # Código fuente
│   ├── .env               # Variables de entorno (no en git)
│   ├── package.json
│   ├── package-lock.json
│   └── ...

/etc/nginx/
├── sites-available/
│   └── babyguardian       # Configuración de nginx
└── sites-enabled/
    └── babyguardian       # Link a la configuración

/etc/letsencrypt/live/babyguardian.golinkia.com/
├── fullchain.pem          # Certificado SSL
└── privkey.pem            # Llave privada

/var/log/nginx/
├── babyguardian-access.log
└── babyguardian-error.log
```

---

## 🚨 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| "Connection refused" | Verificar: `systemctl status babyguardian-backend` |
| "Invalid certificate" | Check: `sudo certbot certificates` |
| "401 Unauthorized" | Hash incorrecto, verificar `X-App-Hash` header |
| "502 Bad Gateway" | Backend caído: `journalctl -u babyguardian-backend -n 50` |
| "DNS not resolving" | Check: `dig babyguardian.golinkia.com` |

---

## 📞 Comandos de Soporte

```bash
# Estado general
systemctl status babyguardian-backend

# Logs en tiempo real
journalctl -u babyguardian-backend -f

# Ver procesos
ps aux | grep node

# Test de conectividad
curl -H "X-App-Hash: <hash>" https://babyguardian.golinkia.com/health

# Reiniciar todo
systemctl restart babyguardian-backend
systemctl reload nginx
```

---

## 🔄 Próximos Pasos

1. **Ejecutar setup-complete.sh** ← EMPEZAR AQUÍ
2. **Configurar variables de entorno** (.env)
3. **Integrar hash en la app**
4. **Testear en producción**
5. **Configurar backups y monitoreo**

---

## 📝 Notas Importantes

⚠️ **SEGURIDAD**: El hash NO es una contraseña. Usalo junto con:
- JWT para autenticación de usuario
- CORS restrictivo
- Rate limiting (ya incluido)
- HTTPS forzado (ya incluido)

⚠️ **DNS**: Espera 5-10 minutos después de actualizar DNS antes de ejecutar el setup

⚠️ **CERTIFICADO**: Certbot renovará automáticamente, pero monitorea:
```bash
sudo certbot renew --dry-run
```

---

## 📖 Links Útiles

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [NestJS Production Checklist](https://docs.nestjs.com/deployment)
- [PostgreSQL Administration](https://www.postgresql.org/docs/)

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintainer**: BabyGuardian Team
