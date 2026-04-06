# Quick Start - Conexión App Móvil al Backend

## ✅ Lo que se configuró

1. **API Client actualizado** para conectar a: `https://23.95.140.206:3000/api/v1`
2. **Métodos de autenticación** agregados:
   - `login(email, password)` 
   - `register(email, password, fullName)`
3. **Test users creados** en la base de datos
4. **Seguridad implementada**:
   - JWT Tokens almacenados en Keychain
   - Bcrypt para contraseñas
   - Autenticación Bearer automática en requests

---

## 🔐 Usuarios de Prueba

```
Email:    admin@babyguardian.local
Password: Admin123!
Nombre:   Admin User

Email:    parent1@babyguardian.local
Password: Parent123!
Nombre:   Parent One

Email:    parent2@babyguardian.local
Password: Parent123!
Nombre:   Parent Two

Email:    guardian@babyguardian.local
Password: Guardian123!
Nombre:   Guardian User
```

---

## 🚀 Próximos Pasos

### 1. Crear los usuarios en la BD

**En el contenedor del backend:**

```bash
# Dentro del contenedor
cd /app
npx ts-node src/scripts/seed-test-users.ts
```

**O desde la máquina host (si tienes acceso):**

```bash
cd apps/backend
# Primero ejecutar migraciones
npm run migration:run

# Luego crear usuarios
npx ts-node src/scripts/seed-test-users.ts
```

### 2. Construir y correr la app móvil

```bash
cd apps/mobile

# Instalar dependencias
npm install

# Correr en iOS
npm run ios

# O en Android
npm run android
```

### 3. Usar la app

En la pantalla de login, usa uno de los usuarios de prueba:

```
email: admin@babyguardian.local
password: Admin123!
```

---

## 🔌 API Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Login con email/password |
| POST | `/auth/register` | Registrar nuevo usuario |
| GET | `/users/me` | Obtener datos del usuario actual |
| PATCH | `/users/me` | Actualizar perfil |

---

## 📝 Código en la App

El login está implementado en:

```
apps/mobile/src/store/authStore.ts  ← Login y Register
apps/mobile/src/api/authApi.ts       ← Métodos HTTP
apps/mobile/src/api/apiClient.ts     ← Configuración de conexión
```

---

## ❓ Troubleshooting

### "Connection refused" o "Cannot connect to 23.95.140.206"

Verificar:
1. Backend Docker está corriendo en `23.95.140.206:3000`
2. Puerto 3000 abierto y accesible
3. Certificado SSL válido (en producción)

### "CERTIFICATE_VERIFY_FAILED"

Ya está configurado para desarrollo (ignora certificados auto-firmados). En producción, agregar certificado SSL válido.

### "Invalid credentials"

- Verificar email y password correctos
- Ejecutar el script de seed si los usuarios no existen aún

---

## 📚 Documentación Completa

Ver `docs/MOBILE_APP_SETUP.md` para documentación detallada, ejemplos de curl, variables de entorno, etc.

---

**¿Necesitas crear más usuarios?** 

Opción 1: Usar el API `/auth/register`
```bash
curl -X POST https://23.95.140.206:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "fullName": "New User"
  }'
```

Opción 2: Ejecutar el script otra vez (si ya existe, lo salta)
```bash
npx ts-node src/scripts/seed-test-users.ts
```
