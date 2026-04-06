# BabyGuardian Mobile App - Setup & Connection Guide

## Overview

La aplicación móvil está configurada para conectarse al backend desplegado en **23.95.140.206:3000** usando autenticación JWT segura.

## Authentication

### Métodos de Autenticación Soportados

1. **Email & Password** - Login tradicional
2. **Google Sign-In** - Registro e login con cuenta Google
3. **Dev Bypass** - Modo desarrollo (sin autenticación)

### Seguridad Implementada

- **JWT (JSON Web Tokens)** para autenticación sin estado
- **Bcrypt** (salt rounds: 12) para hash de contraseñas
- **Token Storage** en React Native Keychain (almacenamiento seguro del dispositivo)
- **HTTPS** con certificado (configurado para desarrollo con opción de ignorar certificado auto-firmado)
- **Bearer Token** automáticamente incluido en todos los requests autenticados

## Connection Configuration

### URL del Backend

```
https://23.95.140.206:3000/api/v1
```

La URL está configurada en:
- **Archivo**: `apps/mobile/src/api/apiClient.ts`
- **Variable de entorno**: `REACT_NATIVE_API_URL` (opcional)

### Configuración en apiClient.ts

```typescript
const DEFAULT_API_URL = 'https://23.95.140.206:3000/api/v1';

export const apiClient = axios.create({
  baseURL: process.env.REACT_NATIVE_API_URL || DEFAULT_API_URL,
  timeout: 15000,
  httpsAgent: {
    rejectUnauthorized: false, // Para desarrollo con certificados auto-firmados
  },
});
```

## Test Credentials

Los siguientes usuarios de prueba están disponibles:

| Email | Password | Nombre |
|-------|----------|--------|
| admin@babyguardian.local | Admin123! | Admin User |
| parent1@babyguardian.local | Parent123! | Parent One |
| parent2@babyguardian.local | Parent123! | Parent Two |
| guardian@babyguardian.local | Guardian123! | Guardian User |

## API Endpoints

### Authentication (`/auth`)

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@babyguardian.local",
  "password": "Admin123!"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "admin@babyguardian.local",
    "fullName": "Admin User",
    "avatarUrl": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "fullName": "New User"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "newuser@example.com",
    "fullName": "New User",
    "avatarUrl": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Users (`/users`)

#### Get Current User
```
GET /users/me
Authorization: Bearer {token}

Response:
{
  "id": "uuid",
  "email": "admin@babyguardian.local",
  "fullName": "Admin User",
  "avatarUrl": null
}
```

#### Update Profile
```
PATCH /users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "Updated Name",
  "avatarUrl": "https://example.com/avatar.jpg"
}

Response:
{
  "id": "uuid",
  "email": "admin@babyguardian.local",
  "fullName": "Updated Name",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

## Mobile App Usage

### Login Flow

```javascript
import { useAuthStore } from './store/authStore';

function LoginScreen() {
  const { login } = useAuthStore();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // El usuario está autenticado, la app se redirige automáticamente
    } catch (error) {
      console.error('Login failed:', error);
      // Mostrar error al usuario
    }
  };

  return (
    <LoginForm onSubmit={handleLogin} />
  );
}
```

### Register Flow

```javascript
const { register } = useAuthStore();

const handleRegister = async (email, password, fullName) => {
  try {
    await register(email, password, fullName);
    // El usuario está registrado y autenticado
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### Token Persistence

El token JWT se almacena automáticamente en el React Native Keychain:
- **Service**: `babyguardian.jwt`
- **Storage**: Keychain (iOS) / Keystore (Android)
- **Recuperación**: Automática al iniciar la app

### Dev Bypass (Desarrollo)

Para desarrollo sin autenticación:

```bash
REACT_NATIVE_AUTH_DEV_BYPASS=true npm run start
```

## Environment Variables

En `apps/mobile/.env` o `.env.local`:

```env
# Backend API
REACT_NATIVE_API_URL=https://23.95.140.206:3000/api/v1

# Google Sign-In (opcional)
REACT_NATIVE_GOOGLE_WEB_CLIENT_ID=your-google-client-id

# Dev Mode
REACT_NATIVE_AUTH_DEV_BYPASS=false
```

## Troubleshooting

### Error: "CERTIFICATE_VERIFY_FAILED"

**Causa**: Certificado SSL auto-firmado o inválido

**Solución**: 
- El código ya está configurado con `rejectUnauthorized: false` para desarrollo
- En producción, asegurar certificado SSL válido en el servidor

### Error: "Invalid credentials"

**Verificar**:
- Email y contraseña correctos
- El usuario existe en la base de datos
- La base de datos está disponible

### App no se conecta al servidor

**Verificar**:
- IP y puerto correcto: `23.95.140.206:3000`
- Backend Docker está corriendo
- Puerto 3000 está abierto y accesible
- Conexión de red disponible

```bash
# Test desde terminal
curl -k https://23.95.140.206:3000/api/v1/health
```

## Creating Test Users in Database

Para crear más usuarios de prueba en la base de datos:

### Opción 1: Ejecutar script de seed

```bash
cd apps/backend
npm run migration:run  # Ejecutar migraciones primero
npx ts-node src/scripts/seed-test-users.ts
```

### Opción 2: Crear via API

```bash
curl -X POST https://23.95.140.206:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "fullName": "New User"
  }'
```

## API Documentation

La documentación completa de la API está disponible en:

```
https://23.95.140.206:3000/api/docs
```

(Swagger UI - si está habilitado)

## Security Best Practices

1. **Contraseñas**:
   - Mínimo 8 caracteres
   - Incluir números, letras mayúsculas y caracteres especiales
   - No reutilizar contraseñas

2. **Tokens JWT**:
   - Nunca exponerlos en logs o documentación
   - Almacenados de forma segura en Keychain
   - Se envían solo en headers HTTPS

3. **HTTPS**:
   - Todos los requests deben ser HTTPS
   - En producción, certificado SSL válido requerido

4. **Datos Sensibles**:
   - Los hashes de contraseña nunca se retornan en responses
   - Campos sensibles están encriptados en la base de datos
