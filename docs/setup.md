# BabyGuardian Setup Guide

## Prerequisites

- Docker + Docker Compose
- Node.js 20+
- Android Studio (for Hub app)
- React Native CLI (for Mobile app)

## Backend (Local Docker)

```bash
# Start PostgreSQL + Redis
cd docker
docker compose -f docker-compose.dev.yml up -d

# Install backend dependencies
cd ../apps/backend
cp .env.example .env
# Edit .env with your actual values

npm install
npm run start:dev
```

API available at: http://localhost:3000/api/v1
Swagger docs: http://localhost:3000/api/docs

## Mobile App

```bash
cd apps/mobile
npm install

# Android
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

## Android Hub App

1. Open `apps/hub` in Android Studio
2. Wait for Gradle sync
3. Configure Firebase:
   - Create Firebase project at console.firebase.google.com
   - Add Android app with package `cl.babyguardian.hub`
   - Download `google-services.json` to `apps/hub/app/`
4. Run on tablet (API 26+)

## Environment Variables

### Backend `.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | localhost dev |
| `REDIS_URL` | Redis connection string | localhost:6379 |
| `JWT_SECRET` | JWT signing secret | change in prod! |
| `FCM_SERVER_KEY` | Firebase Cloud Messaging key | required for push |
| `CORS_ORIGINS` | Allowed CORS origins | localhost:8081 |

## Production Docker Deploy

```bash
cd docker
# Edit docker-compose.yml with production secrets
docker compose up -d

# Check logs
docker compose logs -f backend
```

## Camera Setup (RTSP)

Supported cameras:
- EZVIZ (C6N, C3W Pro, etc.) — enable RTSP in camera settings
- Tapo (C200, C210, etc.) — enable RTSP in Tapo app
- Hikvision — default RTSP enabled
- Any ONVIF-compatible camera

RTSP URL formats:
- EZVIZ: `rtsp://user:pass@camera-ip:554/h264/ch1/main/av_stream`
- Tapo: `rtsp://user:pass@camera-ip:554/stream1`
- Generic: `rtsp://camera-ip:554/`
