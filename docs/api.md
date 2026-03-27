# BabyGuardian API Reference

Base URL: `https://your-domain.com/api/v1`
Swagger UI: `https://your-domain.com/api/docs`

## Authentication

All endpoints (except `/auth/*`) require Bearer token:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |

### Babies

| Method | Path | Description |
|--------|------|-------------|
| GET | `/babies` | List babies in home |
| POST | `/babies` | Create baby profile |
| GET | `/babies/:id` | Get baby details |
| PUT | `/babies/:id` | Update baby |

### Feeding

| Method | Path | Description |
|--------|------|-------------|
| POST | `/feeding` | Log feeding record |
| GET | `/feeding?babyId=&date=` | Get feeding history |
| GET | `/feeding/summary/:babyId` | Daily/weekly summary |

### Events

| Method | Path | Description |
|--------|------|-------------|
| POST | `/events` | Create event (from Hub) |
| GET | `/events?homeId=&limit=` | Get event feed |
| PATCH | `/events/:id/acknowledge` | Acknowledge event |

### Vaccines

| Method | Path | Description |
|--------|------|-------------|
| GET | `/vaccines/catalog?country=CL` | Get vaccine catalog |
| GET | `/vaccines/baby/:babyId` | Get baby's vaccine schedule |
| PATCH | `/vaccines/baby/:id` | Update vaccine status |

### Devices (Hub)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/devices/register` | Register device token (FCM) |
| DELETE | `/devices/:id` | Unregister device |

### Homes

| Method | Path | Description |
|--------|------|-------------|
| POST | `/homes` | Create home |
| GET | `/homes/me` | Get user's homes |
| POST | `/homes/:id/invite` | Generate invite token |
| POST | `/homes/join` | Join home via token |

## Request Examples

### Register user
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"papa@test.cl","password":"mi_pass_123","fullName":"Felipe"}'
```

### Log feeding
```bash
curl -X POST http://localhost:3000/api/v1/feeding \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"babyId":"uuid","feedingType":"breastfeeding","startTime":"2024-01-15T03:00:00Z","durationMinutes":20,"breastSide":"left"}'
```

### Create cry event (from Hub)
```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"homeId":"uuid","babyId":"uuid","eventType":"cry_detected","severity":"warning","confidence":0.87}'
```
