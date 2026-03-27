# BabyGuardian Architecture

## Overview

BabyGuardian is a privacy-first smart baby monitor. Video and audio stay on the LAN; only event metadata reaches the cloud.

```
[RTSP Camera] ──► [Android Tablet Hub] ──► [Backend API] ──► [Mobile App]
                       │                         │
                  TFLite (cry)              PostgreSQL
                  ML Kit (face)               Redis
                  ObjectBox (vectors)          FCM
                  libvlc (RTSP)
```

## Components

### Android Hub (`apps/hub`)
- **Jetpack Compose** UI, landscape-first for tablet
- **libvlc-android** for RTSP/ONVIF camera streaming
- **TensorFlow Lite** for on-device cry detection (audio classification)
- **ML Kit + MobileFaceNet** for face detection and embedding extraction
- **ObjectBox 4.0** vector database for local face embeddings (ANN search)
- **BabyMonitorService** foreground service running 24/7 (START_STICKY)
- **Hilt** for dependency injection
- **Room + SQLCipher** for encrypted local data storage

### React Native Mobile (`apps/mobile`)
- **React Navigation** with bottom tabs
- **Zustand** for lightweight state management
- **React Query** for server state / API caching
- **react-native-vlc-media-player** for remote camera viewing
- **Firebase Messaging** for push notifications
- **Biometric auth** (FaceID / fingerprint)

### Backend (`apps/backend`)
- **NestJS** with TypeORM
- **PostgreSQL 16** for persistent data
- **Redis 7** for session caching and pub/sub
- **JWT** authentication
- **Swagger** at `/api/docs`
- **FCM** push notification dispatch

## Data Flow: Cry Alert

```
1. Microphone → TFLite model → confidence score
2. BabyMonitorService: confidence > 0.75 → onCryDetected()
3. AlertEscalationManager: debounce 30s → send event to backend API
4. Backend: save event to DB → trigger FCM
5. FCM → Mobile app → push notification
6. Mobile: show alert → user can activate white noise remotely
7. Hub receives FCM command → start white noise playback
```

## Data Flow: Face Recognition

```
1. Camera frame → ML Kit FaceDetector → face bounding boxes
2. Each face cropped → MobileFaceNet TFLite → 128-dim embedding
3. ObjectBox ANN search: find nearest known embedding (cosine similarity)
4. Match > 0.7: identified person; < 0.7: unknown face
5. Unknown face → security_alert event → FCM to parents
6. All faces logged to backend (metadata only, no images)
```

## Privacy Design

- Camera video never leaves LAN (RTSP is local)
- Face embeddings stored on-device in ObjectBox (encrypted)
- Backend only stores event metadata (timestamps, types, confidence)
- API keys stored in Android Keystore / iOS Keychain
- All passwords hashed with bcrypt (cost 12)

## Database Schema

See `/docker/postgres/init.sql` for the complete schema.

Key tables:
- `users`, `homes`, `home_members` — multi-user household management
- `babies` — baby profiles
- `feeding_records` — breastfeeding/formula/solids tracking
- `vaccines_catalog` + `baby_vaccines` — Chile PNI vaccine calendar
- `milestones_catalog` + `baby_milestones` — development milestones 0-24m
- `events` — all monitoring events (cry, face, motion)
- `face_groups` — recognized person catalog
- `smart_devices` + `automation_rules` — IoT integration
- `ai_sessions` — AI assistant conversation history

## Scalability Notes

- Hub app is designed for offline-first; syncs to backend when online
- Backend is stateless; can be horizontally scaled behind a load balancer
- PostgreSQL with connection pooling via TypeORM
- Redis pub/sub for real-time event broadcasting to multiple clients
