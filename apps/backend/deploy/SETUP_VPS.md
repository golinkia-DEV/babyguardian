# BabyGuardian - Setup Completo en VPS

Guía paso a paso para desplegar tu backend en un VPS con **Nginx**, **SSL Let's Encrypt** y **Validación de Hash**.

## 🚀 Inicio Rápido

```bash
# En tu VPS (como root)
sudo bash setup-complete.sh

# Te pedirá:
# 1. Dominio (ej: babyguardian.golinkia.com)
# 2. Email para SSL (ej: admin@golinkia.com)
# 3. Hash de acceso (32 caracteres hex)
```

---

## 📋 Prerequisitos

- **VPS/Servidor**: Ubuntu 20.04+ o Debian 10+
- **Dominio**: `babyguardian.golinkia.com` apuntando a tu IP `23.95.140.206`
- **Acceso SSH**: Con permisos root
- **Node.js 20+**: (se instala automáticamente)

### Verificar DNS antes de empezar

```bash
# Desde tu máquina local
dig babyguardian.golinkia.com

# Debe mostrar: babyguardian.golinkia.com. XXX IN A 23.95.140.206
```

---

## 📝 Paso a Paso

### 1️⃣ Generar el Hash

Elige un hash de 32 caracteres hexadecimales (o genera uno):

```bash
# Generar hash aleatorio
openssl rand -hex 16

# Ejemplo:
# 7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d
```

**Anota este hash, lo necesitarás para tu app.**

### 2️⃣ Conectar a tu VPS

```bash
# Desde tu máquina
ssh root@23.95.140.206

# O si usas una llave:
ssh -i ~/.ssh/your_key root@23.95.140.206
```

### 3️⃣ Descargar el repositorio

```bash
# En el VPS
git clone https://github.com/tu-repo/babyguardian.git
cd babyguardian/apps/backend/deploy

# Hacer el script ejecutable
chmod +x setup-complete.sh

# Ejecutar el setup
sudo bash setup-complete.sh
```

El script te hará preguntas:

```
Dominio: babyguardian.golinkia.com
Email: admin@golinkia.com
Hash: 7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d
```

### 4️⃣ Esperar a que termine

El script instalará:
- ✅ Node.js 20
- ✅ Nginx
- ✅ PostgreSQL
- ✅ Certificado SSL Let's Encrypt
- ✅ Servicio systemd

**Toma ~5-10 minutos.**

---

## ✅ Verificar que está corriendo

### En el VPS

```bash
# Ver estado del backend
systemctl status babyguardian-backend

# Ver logs
journalctl -u babyguardian-backend -f

# Ver nginx
systemctl status nginx
tail -f /var/log/nginx/babyguardian-error.log
```

### Desde tu máquina

```bash
# Health check público (sin hash)
curl https://babyguardian.golinkia.com/health

# API con hash correcto
curl -H "X-App-Hash: 7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d" \
  https://babyguardian.golinkia.com/api/v1

# Swagger
https://babyguardian.golinkia.com/api/docs
```

---

## 🔐 Configurar tu App

El backend requiere el hash en cada request. Ver [HASH_AUTHENTICATION.md](./HASH_AUTHENTICATION.md) para ejemplos en:

- React Native / Expo
- React Web
- Flutter
- Swift (iOS)
- Kotlin (Android)

**Ejemplo rápido para React:**

```javascript
// src/api/config.ts
const API_HASH = '7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d';

const client = axios.create({
  baseURL: 'https://babyguardian.golinkia.com',
});

client.interceptors.request.use((config) => {
  config.headers['X-App-Hash'] = API_HASH;
  return config;
});
```

---

## ⚙️ Configuración Post-Deploy

### 1. Editar variables de entorno

```bash
sudo nano /opt/babyguardian/backend/.env
```

Completa:
- `GROQ_API_KEY` - Para IA
- `GOOGLE_CLIENT_ID` - Para OAuth (opcional)
- `FCM_SERVER_KEY` - Para notificaciones push (opcional)

Después de cambiar:

```bash
sudo systemctl restart babyguardian-backend
```

### 2. Crear base de datos (si aún no)

```bash
# En el VPS
sudo -u postgres psql

# En psql:
CREATE USER babyguardian WITH PASSWORD 'tu_contraseña';
CREATE DATABASE babyguardian_prod OWNER babyguardian;
\q
```

Luego actualiza `.env`:

```env
DATABASE_URL=postgresql://babyguardian:tu_contraseña@localhost:5432/babyguardian_prod
```

### 3. Ejecutar migraciones

```bash
cd /opt/babyguardian/backend
npx prisma migrate deploy
# o según tu ORM
```

---

## 🔄 Cambiar Hash (sin downtime)

Si necesitas cambiar el hash en producción:

```bash
# En el VPS
sudo bash update-hash.sh a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Luego actualiza la app con el nuevo hash
```

---

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
# Backend
journalctl -u babyguardian-backend -f --no-pager

# Nginx (requests)
tail -f /var/log/nginx/babyguardian-access.log

# Nginx (errores)
tail -f /var/log/nginx/babyguardian-error.log

# Requests rechazados (sin hash)
tail -f /var/log/nginx/babyguardian-access.log | grep " 401 "
```

### Verificar salud

```bash
# Health check
curl https://babyguardian.golinkia.com/health | jq

# Uptime del sistema
uptime

# Uso de memoria
free -h

# Uso de disco
df -h /opt/babyguardian

# Procesos node
ps aux | grep node
```

---

## 🛠️ Comandos útiles

### Reiniciar el backend

```bash
sudo systemctl restart babyguardian-backend
```

### Ver configuración nginx

```bash
cat /etc/nginx/sites-available/babyguardian
```

### Renovar certificado SSL

```bash
# Dry run (prueba)
sudo certbot renew --dry-run

# Real
sudo certbot renew
```

### Ver certificado

```bash
sudo certbot certificates
```

### Resetear las contraseñas PostgreSQL

```bash
sudo -u postgres psql
ALTER USER babyguardian WITH PASSWORD 'nueva_contraseña';
\q
```

### Limpiar logs antiguos

```bash
# Nginx
sudo truncate -s 0 /var/log/nginx/babyguardian-access.log
sudo truncate -s 0 /var/log/nginx/babyguardian-error.log

# Systemd (mantener últimas 30 días)
sudo journalctl --vacuum=30d
```

---

## 🐛 Troubleshooting

### El backend no responde

```bash
# Ver logs
journalctl -u babyguardian-backend -n 100

# Ver si el puerto 3000 está abierto
lsof -i :3000

# Reiniciar
sudo systemctl restart babyguardian-backend
```

### SSL no funciona

```bash
# Ver certificado
sudo certbot certificates

# Ver si nginx está escuchando 443
ss -tlnp | grep 443

# Test manualmente
openssl s_client -connect babyguardian.golinkia.com:443
```

### App rechaza requests (401)

1. Verifica que el hash en la app sea **exactamente igual** al del servidor
2. Asegúrate de enviar el header en **TODOS** los requests
3. Verifica en los logs de nginx:
   ```bash
   tail -f /var/log/nginx/babyguardian-error.log | grep 401
   ```

### Base de datos no conecta

```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# Test de conexión
psql postgresql://babyguardian:password@localhost:5432/babyguardian_prod

# Ver errores del backend
journalctl -u babyguardian-backend -n 50
```

---

## 📚 Documentación adicional

- [HASH_AUTHENTICATION.md](./HASH_AUTHENTICATION.md) - Cómo usar el hash en tu app
- [nginx-with-hash.conf](./nginx-with-hash.conf) - Configuración de nginx detallada
- [setup-complete.sh](./setup-complete.sh) - Script de instalación

---

## 🚨 Seguridad

### ⚠️ Cambiar estos valores antes de producción:

- [ ] JWT_SECRET (cambiar en `.env`)
- [ ] CAMERA_ENCRYPTION_KEY (cambiar en `.env`)
- [ ] CORS_ORIGINS (cambiar de `*` a tu dominio)
- [ ] APP_HASH (cambiar a un hash único)

### Backup y recuperación

```bash
# Backup de la base de datos
sudo -u postgres pg_dump babyguardian_prod > backup.sql

# Backup de archivos
tar -czf babyguardian-backup.tar.gz /opt/babyguardian

# Restaurar
tar -xzf babyguardian-backup.tar.gz -C /
```

---

## 🆘 Soporte

Si necesitas ayuda:

1. Revisa los logs: `journalctl -u babyguardian-backend -n 100`
2. Verifica DNS: `dig babyguardian.golinkia.com`
3. Test de conectividad: `curl -v https://babyguardian.golinkia.com/health`
4. Ver estado: `systemctl status babyguardian-backend`

---

## 📞 Contacto

IP del VPS: `23.95.140.206`
Dominio: `babyguardian.golinkia.com`
Email para SSL: (configurado durante setup)
