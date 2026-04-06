# 🧪 BabyGuardian - Testing Post-Deployment

Checklist para verificar que el deployment está funcionando correctamente.

## ✅ Pre-Test Checklist

- [ ] El script `setup-complete.sh` completó exitosamente
- [ ] Obtuviste el hash durante la instalación
- [ ] Anotaste el hash en un lugar seguro
- [ ] DNS apunta a 23.95.140.206

---

## 🔍 Test 1: Verificar que el Backend está Corriendo

### En el VPS

```bash
ssh root@23.95.140.206

# Ver estado
systemctl status babyguardian-backend

# Debería mostrar: ✓ active (running)
```

### Verificar puerto 3000

```bash
lsof -i :3000

# Debería mostrar: node dist/main.js listening on port 3000
```

### Ver logs recientes

```bash
journalctl -u babyguardian-backend -n 20

# Debería terminar con algo como:
# [NestApplication] Nest application successfully started [timestamp]
```

---

## 🌐 Test 2: Verificar Nginx

### Estado de Nginx

```bash
systemctl status nginx

# Debería mostrar: ✓ active (running)
```

### Verificar que escucha puerto 443

```bash
ss -tlnp | grep 443

# Debería mostrar: LISTEN ... 443
```

### Validar configuración

```bash
nginx -t

# Debería mostrar:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

## 🔐 Test 3: Verificar Certificado SSL

### Listar certificados

```bash
certbot certificates

# Debería mostrar: babyguardian.golinkia.com
# Certificate Path: /etc/letsencrypt/live/babyguardian.golinkia.com/fullchain.pem
```

### Verificar que expira en >30 días

```bash
certbot certificates | grep "Expiration"

# Debería mostrar: Expiration Date: XXXX-XX-XX
```

### Test SSL desde tu máquina

```bash
openssl s_client -connect babyguardian.golinkia.com:443 < /dev/null

# Debería mostrar: subject=CN = babyguardian.golinkia.com
#                  Verify return code: 0 (ok)
```

---

## 🌐 Test 4: Rutas Públicas (Sin Hash)

### Health Check

```bash
curl -I https://babyguardian.golinkia.com/health

# Esperado: HTTP/2 200 (sin headers X-App-Hash)
```

### Swagger Documentation

```bash
curl -I https://babyguardian.golinkia.com/api/docs

# Esperado: HTTP/2 200
```

### Health check JSON

```bash
curl https://babyguardian.golinkia.com/health | jq

# Esperado:
# {
#   "status": "ok",
#   "timestamp": "2024-..."
# }
```

---

## 🔑 Test 5: Hash Authentication

### Configurar variable con tu hash

```bash
export API_HASH="<tu_hash_de_32_caracteres>"
echo $API_HASH

# Ejemplo: 7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d
```

### Test SIN hash (debe fallar con 401)

```bash
curl -I https://babyguardian.golinkia.com/api/v1

# Esperado: HTTP/2 401
# Body: {"error": "Invalid or missing X-App-Hash", ...}
```

### Test CON hash INCORRECTO (debe fallar con 401)

```bash
curl -I -H "X-App-Hash: invalid0000000000000000000000" \
  https://babyguardian.golinkia.com/api/v1

# Esperado: HTTP/2 401
```

### Test CON hash CORRECTO (debe pasar)

```bash
curl -I -H "X-App-Hash: $API_HASH" \
  https://babyguardian.golinkia.com/api/v1

# Esperado: HTTP/2 200 o 404 (dependiendo si hay rutas)
```

### Test con GET request completo

```bash
curl -H "X-App-Hash: $API_HASH" \
  https://babyguardian.golinkia.com/health | jq

# Esperado: JSON con status
```

---

## 🗄️ Test 6: Base de Datos

### En el VPS

```bash
sudo -u postgres psql babyguardian_prod -c "SELECT 1"

# Esperado: (1 row)
#           ?column?
#           ----------
#                    1
```

### Verificar tablas (si usas Prisma/TypeORM)

```bash
sudo -u postgres psql babyguardian_prod -c "\dt"

# Esperado: Mostrar tablas de la app
```

---

## 🔄 Test 7: HTTPS Redirect

### HTTP debe redirigir a HTTPS

```bash
curl -I http://babyguardian.golinkia.com

# Esperado: HTTP/1.1 301 Moved Permanently
#           Location: https://babyguardian.golinkia.com/
```

### Seguir redirect

```bash
curl -L http://babyguardian.golinkia.com/health | jq

# Debe seguir el redirect y devolver el health check
```

---

## ⚡ Test 8: Rate Limiting

### Hacer múltiples requests rápido a endpoint de auth

```bash
for i in {1..10}; do
  curl -H "X-App-Hash: $API_HASH" \
    https://babyguardian.golinkia.com/api/v1/auth/login &
done
wait

# Algunos requests pueden devolver 429 (Too Many Requests)
```

---

## 🔍 Test 9: Monitoreo y Logging

### Ver logs de acceso

```bash
tail -f /var/log/nginx/babyguardian-access.log

# Debería mostrar requests que haces
```

### Filtrar requests rechazados (401)

```bash
grep " 401 " /var/log/nginx/babyguardian-access.log | tail -5

# Debería mostrar los requests sin hash correcto
```

### Ver errores de nginx

```bash
tail -f /var/log/nginx/babyguardian-error.log

# Debería estar vacío o mostrar solo warnings
```

---

## 📱 Test 10: Desde una App Real

### React/Web

```javascript
// Copiar el código de HASH_AUTHENTICATION.md
const API_HASH = 'tu_hash_aqui';

fetch('https://babyguardian.golinkia.com/health', {
  headers: { 'X-App-Hash': API_HASH }
})
.then(r => r.json())
.then(console.log)
```

### React Native/Expo

```javascript
const API_HASH = 'tu_hash_aqui';

fetch('https://babyguardian.golinkia.com/health', {
  headers: { 'X-App-Hash': API_HASH }
})
.then(r => r.json())
.then(console.log)
```

### Flutter

```dart
http.get(
  Uri.parse('https://babyguardian.golinkia.com/health'),
  headers: {'X-App-Hash': 'tu_hash_aqui'},
).then((response) => print(response.body));
```

---

## 🚨 Test 11: Troubleshooting

### Si algo falla, chequea:

#### Conexión SSH

```bash
ping 23.95.140.206
ssh -v root@23.95.140.206  # Modo verbose

# Debería conectar sin error
```

#### DNS

```bash
dig babyguardian.golinkia.com
nslookup babyguardian.golinkia.com

# Debería resolver a 23.95.140.206
```

#### Puertos abiertos

```bash
# Desde tu máquina
nmap -p 80,443 babyguardian.golinkia.com

# Esperado:
# 80/tcp  open
# 443/tcp open
```

#### Backend levantado

```bash
# En el VPS
curl -s http://localhost:3000/health | jq

# Debe responder normalmente
```

#### Nginx forwarding

```bash
# En el VPS
curl -s http://localhost/health -H "X-App-Hash: $API_HASH" | jq

# Debe proxear correctamente a backend
```

---

## ✅ Test Checklist Final

- [ ] `systemctl status babyguardian-backend` → active
- [ ] `systemctl status nginx` → active
- [ ] `certbot certificates` → Shows certificate
- [ ] `curl https://babyguardian.golinkia.com/health` → 200
- [ ] `curl https://babyguardian.golinkia.com/api/v1` → 401
- [ ] `curl -H "X-App-Hash: $HASH" https://babyguardian.golinkia.com/api/v1` → No 401
- [ ] `curl http://babyguardian.golinkia.com` → Redirect a HTTPS
- [ ] `tail -f /var/log/nginx/babyguardian-error.log` → Sin errores
- [ ] App se conecta con hash y funciona
- [ ] Health check sin hash sigue funcionando

---

## 📊 Performance Tests (Opcional)

### Latencia de respuesta

```bash
# Medir tiempo promedio
for i in {1..10}; do
  time curl -s -H "X-App-Hash: $API_HASH" \
    https://babyguardian.golinkia.com/health > /dev/null
done

# Esperado: < 100ms por request
```

### Carga concurrente

```bash
# Usar Apache Bench
ab -c 10 -n 100 \
  -H "X-App-Hash: $API_HASH" \
  https://babyguardian.golinkia.com/health

# Ver: Requests per second
```

### Test de SSL/TLS

```bash
# Via ssllabs.com
# Ir a: https://www.ssllabs.com/ssltest/analyze.html?d=babyguardian.golinkia.com

# Esperado: Grade A o mejor
```

---

## 🔐 Security Tests (Opcional)

### Verificar headers de seguridad

```bash
curl -s -I https://babyguardian.golinkia.com | grep -E "Strict|X-Content|X-Frame|X-XSS"

# Debería mostrar:
# Strict-Transport-Security: max-age=31536000
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# X-XSS-Protection: 1; mode=block
```

### Test CORS

```bash
curl -s -I -H "Origin: http://example.com" \
  https://babyguardian.golinkia.com/health

# Verificar headers de Access-Control-*
```

### Verificar cipher suites

```bash
openssl s_client -connect babyguardian.golinkia.com:443 -ciphers 'HIGH:!aNULL'

# Debería conectar con ciphers seguros
```

---

## 📝 Notas

- Todos los tests asumen que ejecutaste `setup-complete.sh` exitosamente
- Reemplaza `7d8f3a2c9e1b4f5a6c8d9e0f1a2b3c4d` con tu hash real
- Si hay errores, consulta los logs: `journalctl -u babyguardian-backend -n 100`
- Para más detalles, ver [SETUP_VPS.md](./SETUP_VPS.md)

---

## ✨ Después de Pasar Todos los Tests

1. ✅ Backend está funcionando correctamente
2. ✅ SSL está funcionando
3. ✅ Hash authentication está funcionando
4. ✅ Rate limiting está activo
5. ✅ Logs están registrándose
6. 🎉 **Tu VPS está listo para producción**

---

**Siguiente paso**: Actualiza tu app para enviar el hash en cada request
(Ver [HASH_AUTHENTICATION.md](./HASH_AUTHENTICATION.md))
