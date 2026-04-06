# BabyGuardian - Autenticación por Hash

Este documento explica cómo configurar tu app (frontend/mobile) para autenticarse con el backend usando un hash.

## ¿Por qué Hash Authentication?

- **Seguridad**: Solo las apps con el hash correcto pueden acceder al backend
- **Sin contraseñas**: No requiere login, es automático
- **Transparent**: La app lo envía automáticamente en cada request
- **Flexible**: Puedes cambiar el hash sin recompilar

## Configuración

### 1. Generar un Hash

El hash debe ser una cadena hexadecimal de **exactamente 32 caracteres**:

```bash
# Generar un hash aleatorio
openssl rand -hex 16

# Ejemplo de resultado:
# 7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d
```

### 2. Instalar el Hash en el Backend

Ejecuta el script de setup:

```bash
sudo bash setup-complete.sh
```

Cuando te pida el hash, ingresa el que generaste (32 caracteres).

### 3. Configurar la App para Enviar el Hash

#### Para aplicaciones **React Native / Expo**:

```javascript
// src/api/client.ts (o donde configures axios/fetch)

const API_HASH = '7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d'; // Tu hash aquí

export const apiClient = axios.create({
  baseURL: 'https://babyguardian.golinkia.com',
  timeout: 30000,
});

// Agregar el hash a TODOS los requests
apiClient.interceptors.request.use((config) => {
  config.headers['X-App-Hash'] = API_HASH;
  return config;
});
```

#### Para aplicaciones **Web (React/Vue/Angular)**:

```javascript
// Ejemplo con fetch
const API_HASH = '7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`https://babyguardian.golinkia.com${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-App-Hash': API_HASH,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

// Uso:
const user = await apiRequest('/api/v1/auth/me');
```

#### Para aplicaciones **Flutter**:

```dart
// lib/services/api_client.dart

import 'package:http/http.dart' as http;

const String API_HASH = '7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d';
const String API_BASE_URL = 'https://babyguardian.golinkia.com';

class ApiClient {
  static Future<http.Response> get(String endpoint) {
    return http.get(
      Uri.parse('$API_BASE_URL$endpoint'),
      headers: {
        'X-App-Hash': API_HASH,
        'Content-Type': 'application/json',
      },
    );
  }

  static Future<http.Response> post(String endpoint, dynamic body) {
    return http.post(
      Uri.parse('$API_BASE_URL$endpoint'),
      headers: {
        'X-App-Hash': API_HASH,
        'Content-Type': 'application/json',
      },
      body: jsonEncode(body),
    );
  }
}
```

#### Para aplicaciones **iOS (Swift)**:

```swift
// NetworkService.swift

import Foundation

class NetworkService {
    static let apiHash = "7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d"
    static let baseURL = URL(string: "https://babyguardian.golinkia.com")!
    
    static func request<T: Decodable>(
        endpoint: String,
        method: String = "GET",
        body: Encodable? = nil
    ) async throws -> T {
        var request = URLRequest(url: baseURL.appendingPathComponent(endpoint))
        request.httpMethod = method
        request.setValue(apiHash, forHTTPHeaderField: "X-App-Hash")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let body = body {
            request.httpBody = try JSONEncoder().encode(body)
        }
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw NSError(domain: "API Error", code: -1)
        }
        
        return try JSONDecoder().decode(T.self, from: data)
    }
}
```

#### Para aplicaciones **Android (Kotlin)**:

```kotlin
// ApiClient.kt

import okhttp3.OkHttpClient
import okhttp3.Request
import retrofit2.Retrofit

object ApiClient {
    private const val API_HASH = "7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d"
    private const val BASE_URL = "https://babyguardian.golinkia.com/"
    
    private val httpClient = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val originalRequest = chain.request()
            val newRequest = originalRequest.newBuilder()
                .header("X-App-Hash", API_HASH)
                .build()
            chain.proceed(newRequest)
        }
        .build()
    
    private val retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(httpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    fun <T> create(service: Class<T>): T = retrofit.create(service)
}
```

## Rutas Públicas (Sin Requierir Hash)

Estas rutas NO requieren el header `X-App-Hash`:

- `GET /health` - Health check del backend
- `GET /api/docs` - Documentación Swagger
- `GET /api-json` - OpenAPI JSON

Todas las otras rutas requieren el hash válido.

## Cambiar el Hash

Si necesitas cambiar el hash (por ejemplo, si se expone):

### 1. Editar nginx

```bash
# En el servidor VPS
sudo nano /etc/nginx/sites-available/babyguardian

# Busca esta sección:
# map $http_x_app_hash $app_hash_valid {
#     default 0;
#     7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d  1;  # CAMBIO AQUÍ
# }

# Reemplaza el hash antiguo con el nuevo
# Luego recarga nginx:
sudo systemctl reload nginx
```

### 2. Actualizar la app

Cambia el valor de `API_HASH` en tu app y redeploy.

## Seguridad

### ⚠️ Consideraciones Importantes

1. **El hash es enviar por HTTPS** - Siempre usa `https://` nunca `http://`
2. **No es una contraseña** - Es como un API key, no encriptado en la app
3. **Si se expone**, cambia el hash en el servidor
4. **Para más seguridad**, combina con:
   - Verificación de firma (JWT)
   - Rate limiting (ya está en nginx)
   - CORS restrictivo (solo tu dominio)

### Ejemplo: Combinar con JWT

Si quieres más seguridad, puedes usar JWT además del hash:

```javascript
// El hash permite acceder a la app
// El JWT autentica al usuario específico

const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'X-App-Hash': API_HASH, // Permite acceso
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password',
  }),
});

const { accessToken } = await response.json();

// En requests posteriores:
fetch('/api/v1/user/profile', {
  headers: {
    'X-App-Hash': API_HASH, // Permite acceso
    'Authorization': `Bearer ${accessToken}`, // Autentica usuario
  },
});
```

## Troubleshooting

### "Unauthorized - Invalid or missing X-App-Hash"

El backend devuelve 401 cuando:

1. **Falta el header** - Verifica que estés enviando `X-App-Hash`
2. **Hash incorrecto** - Verifica que el hash sea exactamente 32 caracteres
3. **Hash expiró** - Si cambió el hash en el servidor, actualiza la app

### Test manual con curl

```bash
# Sin hash (debe fallar)
curl -I https://babyguardian.golinkia.com/api/v1

# Con hash correcto (debe funcionar)
curl -I -H "X-App-Hash: 7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d" \
  https://babyguardian.golinkia.com/api/v1

# Ruta pública (funciona sin hash)
curl -I https://babyguardian.golinkia.com/health
```

## Variables de Entorno

En lugar de hardcodear el hash, usa variables:

### React Native

```javascript
// .env (no subir a git)
API_HASH=7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d

// Dentro de la app
import Config from 'react-native-config';
const API_HASH = Config.API_HASH;
```

### Web (webpack/vite)

```env
# .env.production
VITE_API_HASH=7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d
```

```javascript
const API_HASH = import.meta.env.VITE_API_HASH;
```

## Monitoreo

Ver requests rechazados por hash inválido:

```bash
# En el servidor VPS
tail -f /var/log/nginx/babyguardian-error.log

# Filtrar solo 401s
tail -f /var/log/nginx/babyguardian-access.log | grep " 401 "
```

---

¿Preguntas? Ver logs del backend:

```bash
journalctl -u babyguardian-backend -f
```
