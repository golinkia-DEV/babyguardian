# BabyGuardian

Smart baby monitor with Edge AI, RTSP cameras, face recognition, IoT integration and AI assistant.

## Architecture

```
babyguardian/
├── apps/
│   ├── hub/         # Android Kotlin - Tablet hub (Edge AI, RTSP, face recognition)
│   ├── mobile/      # React Native - Parent mobile app (iOS + Android)
│   └── backend/     # NestJS REST API
├── packages/
│   ├── shared-types/  # Shared TypeScript types
│   └── ai-client/     # AI integrations (Groq, OpenAI, Claude, Gemini)
└── docker/          # Docker Compose for local backend
```

## Quick Start

### Backend (local Docker)
```bash
cd docker
docker compose -f docker-compose.dev.yml up -d
cd ../apps/backend
cp .env.example .env
npm install
npm run start:dev
```

### Mobile App
```bash
cd apps/mobile
npm install
npx react-native run-android
```

### Tablet Hub
Open `apps/hub` in Android Studio and run on tablet (API 26+).

## Features

- **Live RTSP camera feed** — EZVIZ, Tapo, Hikvision via libvlc
- **Cry detection** — TensorFlow Lite audio model, runs on-device
- **Face recognition** — ML Kit + MobileFaceNet + ObjectBox vector DB
- **Feeding tracker** — quick logging, reminders, history
- **Vaccine calendar** — Chile PNI schedule, notifications
- **Development milestones** — 0–24 months tracking
- **AI assistant** — Groq/OpenAI/Claude/Gemini with baby profile context
- **Smart lights** — WiFi bulbs automation on cry events
- **White noise** — local playback with auto-activation
- **Multi-user** — parent, caregiver (time-limited), guest roles

## Privacy

- Video and audio never leave the LAN (except event metadata for push notifications)
- Face embeddings stored locally with SQLCipher encryption
- API keys stored in Android Keystore / iOS Keychain
- Backend only handles accounts, tokens, and event metadata

## Stack

| Layer | Technology |
|-------|-----------|
| Tablet hub | Android Kotlin + Jetpack Compose |
| Mobile app | React Native (iOS + Android) |
| Video | libvlc-android (RTSP/ONVIF) |
| Face recognition | ML Kit + MobileFaceNet + ObjectBox 4.0 |
| Local DB | Room + SQLCipher |
| Cry detection | TensorFlow Lite |
| Push notifications | FCM + APNs |
| Backend | NestJS + PostgreSQL 16 + Redis 7 |
| AI | Groq / OpenAI / Anthropic / Gemini |

## Docs

- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Setup Guide](docs/setup.md)

## License

MIT
