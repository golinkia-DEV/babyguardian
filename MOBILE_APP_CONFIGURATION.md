# Mobile App Configuration Guide

## API URLs por Entorno

### Development (Emulator/Local)

Si estás usando el **emulador Android**, la app necesita conectar a `10.0.2.2` que es la IP especial para acceder al host desde el emulador:

```bash
# Para emulador Android (localhost del host)
REACT_NATIVE_API_URL=http://10.0.2.2:3000/api/v1

# Para iOS Simulator (localhost del host)
REACT_NATIVE_API_URL=http://localhost:3000/api/v1

# Para dispositivo físico en la misma red
REACT_NATIVE_API_URL=http://192.168.1.X:3000/api/v1  # Reemplaza X con tu IP
```

### Production

```bash
# Servidor remoto
REACT_NATIVE_API_URL=https://babyguardian.golinkia.com/api/v1
```

---

## Pasos para Configurar

### 1. Para Desarrollo (Emulador Android)

```bash
cd apps/mobile

# Copia el archivo de desarrollo
cp .env.development .env.local

# Edita .env.local para tu entorno:
# Si usas emulador Android:
REACT_NATIVE_API_URL=http://10.0.2.2:3000/api/v1

# Si usas iOS Simulator:
REACT_NATIVE_API_URL=http://localhost:3000/api/v1

# Luego construye y corre:
npm run android    # Para Android emulator
# o
npm run ios        # Para iOS simulator
```

### 2. Para Producción

```bash
cd apps/mobile

# Copia el archivo de producción
cp .env.production .env.local

# El archivo ya tiene la URL correcta:
REACT_NATIVE_API_URL=https://babyguardian.golinkia.com/api/v1

# Construye la release
npm run build      # O usar EAS si tienes Expo
```

---

## Estructura de URLs

| Entorno | URL | Puerto | Notas |
|---------|-----|--------|-------|
| **Android Emulator** | http://10.0.2.2:3000/api/v1 | 3000 | IP especial del emulador para localhost |
| **iOS Simulator** | http://localhost:3000/api/v1 | 3000 | Puede acceder a localhost directamente |
| **Dispositivo Físico (red local)** | http://192.168.1.X:3000/api/v1 | 3000 | Necesita IP actual del host |
| **Producción** | https://babyguardian.golinkia.com/api/v1 | 443 | HTTPS + dominio remoto |

---

## Solucionar Problemas

### "Failed to connect to /10.0.2.2:3000"

**Causa**: El backend no está corriendo o no está accesible desde el emulador

**Solución**:
```bash
# Verifica que Docker está corriendo
docker-compose -f docker/docker-compose.yml ps

# Verifica que el backend está escuchando
curl -s http://localhost:3000/health

# Si no funciona, reconstruye:
docker-compose -f docker/docker-compose.yml up --build -d
```

### "Failed to connect to localhost:3000"

**Causa**: Estás usando iOS Simulator pero el backend en local no está corriendo

**Solución**: Mismo que arriba

### "Certificate error" en HTTPS

**Causa**: Certificado SSL auto-firmado en desarrollo

**Solución**: En desarrollo, la app ya está configurada para ignorar errores de certificado.

### "Cannot resolve babyguardian.golinkia.com"

**Causa**: El emulador no tiene acceso a internet o DNS no está configurado

**Solución**:
- Asegurate que el emulador tiene internet habilitado
- Prueba con `ping 8.8.8.8` en la terminal del emulador
- Si usa VPN, puede bloquear el acceso

---

## Variables de Entorno

### `.env.development`
Para desarrollo local con backend corriendo en tu máquina

### `.env.production`
Para production con servidor remoto

### `.env.local`
Archivo local (no commitear a Git) con tu configuración personal

---

## Archivo `.env.local` Recomendado

Crea este archivo en `apps/mobile/` según tu entorno:

**Para Android Emulator:**
```env
REACT_NATIVE_API_URL=http://10.0.2.2:3000/api/v1
REACT_NATIVE_GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com
REACT_NATIVE_AUTH_DEV_BYPASS=false
```

**Para iOS Simulator:**
```env
REACT_NATIVE_API_URL=http://localhost:3000/api/v1
REACT_NATIVE_GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com
REACT_NATIVE_AUTH_DEV_BYPASS=false
```

**Para Dispositivo Físico (reemplaza 192.168.1.100 con tu IP):**
```env
REACT_NATIVE_API_URL=http://192.168.1.100:3000/api/v1
REACT_NATIVE_GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com
REACT_NATIVE_AUTH_DEV_BYPASS=false
```

**Para Producción:**
```env
REACT_NATIVE_API_URL=https://babyguardian.golinkia.com/api/v1
REACT_NATIVE_GOOGLE_WEB_CLIENT_ID=your_client_id.apps.googleusercontent.com
REACT_NATIVE_AUTH_DEV_BYPASS=false
```

---

## Comandos para Construir

### Desarrollo
```bash
cd apps/mobile

# Android Emulator
npm run android

# iOS Simulator
npm run ios

# Con logs
npm run android -- --verbose
```

### Producción

```bash
# Build para Android (genera APK/AAB)
npm run build:android

# Build para iOS (genera IPA)
npm run build:ios

# O usar EAS (si tienes cuenta Expo)
eas build
```

---

## .gitignore

Asegurate que `.env.local` está en `.gitignore`:

```
# Environment
.env
.env.local
.env.*.local
```

Esto previene que variables sensibles se commiteen accidentalmente.

---

## Próximos Pasos

1. ✅ Crea tu `.env.local` en `apps/mobile/`
2. ✅ Configura la URL correcta según tu entorno
3. ✅ Construye la app: `npm run android` o `npm run ios`
4. ✅ Verifica que conecta al backend
5. ✅ Prueba login con `admin@babyguardian.local` / `Admin@12345`
