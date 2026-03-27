# BabyGuardian - Riesgos y Mitigaciones

## Riesgos Técnicos

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Tablet se sobrecalienta | Alto - servicio interrumpido | Monitor de CPU/temperatura en foreground service; alertas al usuario >65°C; reducir resolución de procesamiento |
| WiFi cae y no se reconecta | Alto - sin monitoreo | Auto-reconexión exponencial (5s, 10s, 30s, 60s); notificación crítica si offline >2min |
| Falso positivo de llanto | Medio - estrés del padre | Umbral configurable; modo entrenamiento; historial de confirmaciones |
| Cámara se desconecta | Alto - sin video | Reconexión automática; indicador visual "Sin señal"; alerta push si offline >5min |
| Pérdida de la tablet | Alto - pérdida de datos | Backup cifrado opcional a Google Drive; re-sincronización rápida con nuevo dispositivo |
| Foreground service eliminado por Android | Alto - sin monitoreo | REQUEST_IGNORE_BATTERY_OPTIMIZATIONS; BOOT_COMPLETED receiver; modo doze-aware |

## Riesgos de IA

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Modelo de llanto confunde ruidos (aspirador, TV) | Medio - falsos positivos | Período de silencio configurable; botón "No era llanto" para feedback activo |
| Reconocimiento facial falla con mascarilla/gorra | Medio - alerta incorrecta | Umbral de confianza configurable; modo "desconocido seguro" para personas frecuentes |
| Recomendación de IA incorrecta o peligrosa | Alto - daño al bebé | Disclaimer médico en cada respuesta; botón "Reportar respuesta incorrecta"; sin recomendaciones de medicamentos |
| Fragmentación de rostros por cambio de apariencia | Bajo - confusión de identidad | Fusión manual de grupos; confirmación periódica de identidades |

## Riesgos de Seguridad/Privacidad

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Acceso no autorizado al video | Crítico | Video nunca sale de LAN; autenticación JWT para API; sin relay de video en la nube |
| API Key de IA expuesta | Alto | Android Keystore; nunca en logs ni código fuente |
| Token de vinculación interceptado | Alto | Token de un solo uso, 5 min de validez, HTTPS obligatorio |
| Datos del bebé expuestos | Crítico | SQLCipher en Room; HTTPS en backend; sin datos en logs |

## Riesgos Legales

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Incumplimiento Ley 19.628 Chile | Alto | Consentimiento explícito; centro de privacidad; DPA registrado |
| Datos biométricos de menores | Alto | Procesamiento solo local; sin envío a nube; borrado en 1 clic |
| Responsabilidad por recomendaciones médicas | Crítico | Disclaimer claro "no soy médico"; reportes de respuestas incorrectas; sin diagnósticos |

## Riesgos de UX

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Padre primerizo no entiende RTSP | Alto - abandono del producto | Guías visuales por marca (EZVIZ, Tapo, Hikvision); videos cortos de configuración |
| Alertas excesivas (alert fatigue) | Alto - ignorar alertas críticas | Niveles de escalación; modo "no molestar"; historial de falsas alarmas |
| Configuración muy técnica | Medio - abandono | Modo simple (solo ver y recibir alertas) vs modo avanzado (config completa) |

## Plan de Continuidad

1. **Tablet perdida**: Comprar nueva tablet, instalar app, escanear QR desde móvil, listo en <5 min
2. **Cambio de red WiFi**: Re-escanear cámaras, vincular de nuevo (2 min)
3. **Backend caído**: App funciona en modo offline completo; eventos se sincronizan al volver
4. **API de IA no disponible**: Chat deshabilitado; resto de la app funciona normalmente
