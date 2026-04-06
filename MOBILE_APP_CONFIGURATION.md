# Mobile App Configuration

## API Endpoint

La aplicación móvil se conecta a un único servidor remoto en producción:

```
https://babyguardian.golinkia.com/api/v1
```

Esta URL está configurada directamente en el código sin necesidad de variables de entorno:

```typescript
// apps/mobile/src/api/apiClient.ts
const API_URL = 'https://babyguardian.golinkia.com/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});
```

---

## Autenticación

### Usuarios de Prueba

| Email | Contraseña | Nombre |
|-------|-----------|--------|
| admin@babyguardian.local | Admin@12345 | Admin User |
| parent1@babyguardian.local | Parent123! | Parent One |
| parent2@babyguardian.local | Parent123! | Parent Two |
| guardian@babyguardian.local | Guardian123! | Guardian User |

### Crear Nuevo Usuario

Puedes registrar un nuevo usuario en la app usando el endpoint `/auth/register`:

```bash
curl -sk -X POST https://babyguardian.golinkia.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yourname@example.com",
    "password": "YourPassword123!",
    "fullName": "Your Name"
  }'
```

---

## Construcción y Despliegue

### Para Android

```bash
cd apps/mobile

# Instalar dependencias
npm install

# Construir para emulador
npm run android

# Construir release para Play Store
npm run build:android
```

### Para iOS

```bash
cd apps/mobile

# Instalar dependencias
npm install

# Construir para simulator
npm run ios

# Construir release para App Store
npm run build:ios
```

---

## Endpoints Disponibles

### Autenticación

```
POST   /api/v1/auth/login              → Login con email/contraseña
POST   /api/v1/auth/register           → Registrar nuevo usuario
POST   /api/v1/auth/google             → Google Sign-In
```

### Usuario

```
GET    /api/v1/users/me                → Obtener perfil actual
PATCH  /api/v1/users/me                → Actualizar perfil
```

### Otros (requieren token JWT)

```
GET    /api/v1/babies                  → Lista de bebés
GET    /api/v1/homes                   → Hogar del usuario
GET    /api/v1/cameras                 → Cámaras
GET    /api/v1/devices                 → Dispositivos inteligentes
GET    /api/v1/vaccines                → Vacunas
GET    /api/v1/ai/chat                 → Chat de IA
```

---

## Características Principales

✅ **Autenticación JWT segura**
- Login con email/contraseña
- Google Sign-In
- Token almacenado en Keychain (iOS) / Keystore (Android)

✅ **Gestión de Bebés**
- Crear y editar perfiles de bebés
- Registrar hitos del desarrollo

✅ **Monitoreo con Cámaras**
- Streaming de video en vivo
- Grabación y reproducción

✅ **Dispositivos Inteligentes**
- Control de monitores de bebé
- Luz nocturna, música blanca, etc.

✅ **Vacunaciones**
- Calendario de vacunas
- Recordatorios automáticos

✅ **Chat de IA**
- Asistente de crianza con IA
- Recomendaciones personalizadas

---

## Solucionar Problemas

### "Cannot connect to babyguardian.golinkia.com"

**Verificar**:
1. El servidor está corriendo: `curl https://babyguardian.golinkia.com/api/v1/health`
2. Tienes conexión a internet en el dispositivo/emulador
3. El firewall no bloquea el acceso

### "SSL Certificate Error"

**Causa**: Certificado auto-firmado en servidor

**Solución**: La app ya está configurada para aceptar certificados auto-firmados en desarrollo

### "Unauthorized (401)"

**Verificar**:
- Las credenciales son correctas
- El token JWT no ha expirado
- El token se está enviando en el header `Authorization: Bearer <token>`

### "User not found"

**Solución**:
1. Crear un usuario nuevo vía `/auth/register`
2. Usar uno de los usuarios de prueba listados arriba

---

## Próximos Pasos

1. ✅ Descargar el código
2. ✅ Ejecutar `npm install` en `apps/mobile/`
3. ✅ Construir: `npm run android` o `npm run ios`
4. ✅ Abrir la app en emulador/dispositivo
5. ✅ Hacer login con credenciales de prueba
6. ✅ Explorar las funciones

---

## Documentación Adicional

- `DEPLOYMENT_SUMMARY.md` - Overview completo del proyecto
- `docs/NGINX_DEPLOYMENT.md` - Configuración del servidor
- `docs/MOBILE_APP_SETUP.md` - Setup original (referencia)
