# BabyGuardian Mobile - Android Native Project

Configuración completa de proyecto Android nativo para reconocer en Android Studio.

## Requisitos

- Android Studio 2023.1 o superior
- JDK 11 o superior
- SDK compileSdk 34+
- Gradle 8.1.3

## Cómo importar en Android Studio

1. **Abre Android Studio**
2. **File → Open**
3. Selecciona: `/root/repos/babyguardian/apps/mobile/android`
4. Espera a que sincronice Gradle (puede tomar 2-3 minutos)

## Estructura del Proyecto

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/babyguardian/mobile/
│   │   │   │   └── MainActivity.java
│   │   │   └── res/
│   │   │       ├── layout/
│   │   │       ├── values/
│   │   │       ├── mipmap/
│   │   │       └── xml/
│   │   └── test/
│   ├── build.gradle
│   └── proguard-rules.pro
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties
├── build.gradle
├── settings.gradle
├── gradle.properties
└── .gitignore
```

## Compilar desde Android Studio

### Debug APK
1. Selecciona "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
2. Output: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK
1. Selecciona "Build" → "Build Bundle(s) / APK(s)" → "Build Bundle(s)"
2. Configura variables de entorno para signing:
   ```bash
   export KEYSTORE_PATH=path/to/release.keystore
   export KEYSTORE_PASSWORD=your_password
   export KEY_ALIAS=your_alias
   export KEY_PASSWORD=your_key_password
   ```

## Compilar desde terminal

```bash
cd /root/repos/babyguardian/apps/mobile/android

# Sincronizar Gradle
./gradlew sync

# Build APK debug
./gradlew assembleDebug

# Build APK release
./gradlew assembleRelease

# Build Bundle (para Play Store)
./gradlew bundleRelease
```

## Instalar en dispositivo/emulador

```bash
# Asume que tienes un dispositivo conectado o emulador activo
./gradlew installDebug
```

## Permisos configurados

- INTERNET
- CAMERA
- RECORD_AUDIO
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE
- USE_BIOMETRIC
- POST_NOTIFICATIONS
- BODY_SENSORS

## Próximos pasos

1. **Generar debug.keystore:**
   ```bash
   keytool -genkey -v -keystore debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configurar Firebase:**
   - Descargar `google-services.json` desde Firebase Console
   - Colocar en: `android/app/google-services.json`

3. **Crear MainActivity.java completa:**
   - Actualmente es un template básico
   - Reemplazar con lógica de React Native o UI nativa

4. **Agregar dependencias:**
   - Actualizar `build.gradle` según necesidades
