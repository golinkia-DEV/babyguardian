# 📚 BabyGuardian Deployment - Índice Completo

Guía de navegación para toda la documentación y scripts de deployment.

## 🎯 ¿Por dónde empezar?

### Si es la PRIMERA VEZ:
1. **Lee**: [README_DEPLOYMENT.md](README_DEPLOYMENT.md) ← Resumen rápido
2. **Genera**: Un hash → `openssl rand -hex 16`
3. **Ejecuta**: [setup-complete.sh](setup-complete.sh) en tu VPS
4. **Verifica**: [TEST_DEPLOYMENT.md](TEST_DEPLOYMENT.md)
5. **Integra**: Sigue [HASH_AUTHENTICATION.md](HASH_AUTHENTICATION.md)

---

## 📖 Documentación por Rol

### 👨‍💼 DevOps / Admin de Infraestructura

**Lectura esencial:**
- [SETUP_VPS.md](SETUP_VPS.md) - Guía detallada de instalación
- [TEST_DEPLOYMENT.md](TEST_DEPLOYMENT.md) - Validación post-deploy
- [README_DEPLOYMENT.md](README_DEPLOYMENT.md) - Overview técnico

**Scripts a usar:**
- [setup-complete.sh](setup-complete.sh) - Instalación automática
- [update-hash.sh](update-hash.sh) - Cambiar hash en producción

**Archivos de configuración:**
- [nginx-with-hash.conf](nginx-with-hash.conf) - Configuración de Nginx

---

### 👨‍💻 Desarrollador Frontend/Mobile

**Lectura esencial:**
- [HASH_AUTHENTICATION.md](HASH_AUTHENTICATION.md) - Cómo integrar en tu app
- [README_DEPLOYMENT.md](README_DEPLOYMENT.md) - URLs de acceso

**Ejemplos de código incluidos:**
- ✅ React
- ✅ React Native / Expo
- ✅ Vue / Angular
- ✅ Flutter
- ✅ Swift (iOS)
- ✅ Kotlin (Android)

---

### 🔍 QA / Tester

**Lectura esencial:**
- [TEST_DEPLOYMENT.md](TEST_DEPLOYMENT.md) - Checklist de validación
- [SETUP_VPS.md](SETUP_VPS.md) - Troubleshooting

---

## 📁 Estructura de Archivos

```
apps/backend/deploy/
├── 📋 INDEX.md                      ← Estás aquí
├── 📖 README_DEPLOYMENT.md          ← Guía rápida
├── 📚 SETUP_VPS.md                  ← Instalación detallada
├── 🧪 TEST_DEPLOYMENT.md            ← Validación después de instalar
├── 👨‍💻 HASH_AUTHENTICATION.md         ← Integración en app
│
├── 🔧 Scripts de Instalación
│   ├── setup-complete.sh            ← USAR ESTE (instalación automática)
│   ├── setup-nginx-ssl.sh           ← (antiguo, no usar)
│   ├── deploy-vps.sh                ← (antiguo, no usar)
│   └── update-hash.sh               ← Cambiar hash sin downtime
│
├── ⚙️ Configuración
│   ├── nginx-with-hash.conf         ← Config de nginx con validación
│   └── .env.production.template     ← Template de variables
│
└── 📝 Otros
    ├── deploy-to-vps.sh             ← (antiguo)
    └── setup-systemd.sh             ← (antiguo)
```

---

## 🚀 Quick Start

### Paso 1: Generar Hash

```bash
openssl rand -hex 16
# Copia el resultado (32 caracteres)
```

### Paso 2: Ejecutar Setup

```bash
ssh root@23.95.140.206
git clone https://github.com/tu-repo/babyguardian.git
cd babyguardian/apps/backend/deploy
sudo bash setup-complete.sh
# Ingresa el hash cuando pida
```

### Paso 3: Validar

```bash
bash TEST_DEPLOYMENT.md  # Seguir el checklist
```

### Paso 4: Integrar en App

```
Abrir HASH_AUTHENTICATION.md
Copiar el código para tu framework
Agregar el hash en la app
```

---

## 🔐 Hash Authentication - Lo Fundamental

### ¿Qué es?

Un método para permitir acceso al backend **solo desde apps autorizadas**.

### ¿Cómo funciona?

```
App con hash:    ✅ Acceso permitido
App sin hash:    ❌ 401 Unauthorized
App con hash incorrecto: ❌ 401 Unauthorized
```

### ¿En qué archivo está?

- **Documentación**: [HASH_AUTHENTICATION.md](HASH_AUTHENTICATION.md)
- **Configuración Nginx**: [nginx-with-hash.conf](nginx-with-hash.conf)
- **Script de Setup**: [setup-complete.sh](setup-complete.sh)

---

## 🛠️ Comandos Comunes

### Después del Setup

```bash
# Ver status
systemctl status babyguardian-backend

# Ver logs
journalctl -u babyguardian-backend -f

# Reiniciar
systemctl restart babyguardian-backend

# Cambiar hash (sin downtime)
sudo bash update-hash.sh <nuevo_hash>

# Ver configuración nginx
cat /etc/nginx/sites-available/babyguardian

# Test de conectividad
curl -H "X-App-Hash: <hash>" https://babyguardian.golinkia.com/health
```

---

## 📋 Checklist de Implementación

- [ ] Leer [README_DEPLOYMENT.md](README_DEPLOYMENT.md)
- [ ] Generar hash con `openssl rand -hex 16`
- [ ] Ejecutar `bash setup-complete.sh` en VPS
- [ ] Seguir [TEST_DEPLOYMENT.md](TEST_DEPLOYMENT.md)
- [ ] Leer [HASH_AUTHENTICATION.md](HASH_AUTHENTICATION.md)
- [ ] Integrar hash en app (React/React Native/Flutter/etc)
- [ ] Testear que la app se conecta
- [ ] Verificar logs en `/var/log/nginx/babyguardian-access.log`

---

## 🐛 ¿Algo no funciona?

### Por síntoma:

**"Connection refused"**
→ Ver [SETUP_VPS.md](SETUP_VPS.md) → Troubleshooting

**"401 Unauthorized"**
→ Ver [HASH_AUTHENTICATION.md](HASH_AUTHENTICATION.md) → Verificar hash

**"SSL certificate error"**
→ Ver [SETUP_VPS.md](SETUP_VPS.md) → SSL Configuration

**"Nginx error"**
→ Ver [SETUP_VPS.md](SETUP_VPS.md) → Nginx troubleshooting

### General:
→ Ver logs: `journalctl -u babyguardian-backend -n 100`
→ Ver nginx: `tail -f /var/log/nginx/babyguardian-error.log`

---

## 📞 Referencias Rápidas

### Información de Servidor

- **IP**: 23.95.140.206
- **Dominio**: babyguardian.golinkia.com
- **Backend Port**: 3000
- **Nginx Port**: 80, 443

### Ubicaciones Importantes

- **Backend Code**: `/opt/babyguardian/backend`
- **Environment**: `/opt/babyguardian/backend/.env`
- **Nginx Config**: `/etc/nginx/sites-available/babyguardian`
- **SSL Certs**: `/etc/letsencrypt/live/babyguardian.golinkia.com/`
- **Logs Backend**: `journalctl -u babyguardian-backend`
- **Logs Nginx**: `/var/log/nginx/babyguardian-*`

### Servicios

- **Backend**: `systemctl status babyguardian-backend`
- **Nginx**: `systemctl status nginx`
- **PostgreSQL**: `systemctl status postgresql`

---

## 🎓 Documentos por Tópico

### Instalación y Setup
- [README_DEPLOYMENT.md](README_DEPLOYMENT.md) - Overview
- [SETUP_VPS.md](SETUP_VPS.md) - Guía paso a paso
- [setup-complete.sh](setup-complete.sh) - Script automático

### Autenticación y Seguridad
- [HASH_AUTHENTICATION.md](HASH_AUTHENTICATION.md) - Hash auth
- [nginx-with-hash.conf](nginx-with-hash.conf) - Nginx config

### Validación y Testing
- [TEST_DEPLOYMENT.md](TEST_DEPLOYMENT.md) - Post-deploy tests
- [SETUP_VPS.md](SETUP_VPS.md) → Troubleshooting

### Operaciones
- [update-hash.sh](update-hash.sh) - Cambiar hash
- [SETUP_VPS.md](SETUP_VPS.md) → Comandos útiles

---

## 💡 Pro Tips

1. **Guardar el hash**: Usa un password manager, no lo dejes en plain text
2. **Cambiar hash periódicamente**: Cada 3-6 meses por seguridad
3. **Monitorear logs**: `tail -f /var/log/nginx/babyguardian-error.log`
4. **Backup de config**: `cp /etc/nginx/sites-available/babyguardian /tmp/backup`
5. **Test en staging**: Antes de cambiar cosas en producción

---

## 🔄 Versiones de Documentos

| Archivo | Versión | Actualización |
|---------|---------|---------------|
| INDEX.md | 1.0 | 2024 |
| README_DEPLOYMENT.md | 1.0 | 2024 |
| SETUP_VPS.md | 1.0 | 2024 |
| HASH_AUTHENTICATION.md | 1.0 | 2024 |
| TEST_DEPLOYMENT.md | 1.0 | 2024 |
| setup-complete.sh | 1.0 | 2024 |
| update-hash.sh | 1.0 | 2024 |

---

## 🆘 Soporte

**En caso de duda:**

1. Busca en el documento correspondiente (ej: "error 401" → HASH_AUTHENTICATION.md)
2. Revisa los logs: `journalctl -u babyguardian-backend -f`
3. Consulta [SETUP_VPS.md](SETUP_VPS.md) → Troubleshooting
4. Ejecuta [TEST_DEPLOYMENT.md](TEST_DEPLOYMENT.md) nuevamente

---

**Last Updated**: 2024
**Status**: Production Ready ✅
