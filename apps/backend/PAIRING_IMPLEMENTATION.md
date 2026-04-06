# Hub-Mobile Pairing Implementation

## Overview

This document describes the implementation of the hub-first pairing system that allows a hub device to generate secure pairing codes for mobile devices to claim.

## Architecture

### Flow

1. **Hub (tablet) initiates pairing**:
   - User taps "Generate Code" on hub screen
   - Backend creates a `PairingSession` with:
     - 8-character code (base32, no ambiguous chars)
     - Internal `pairingToken` (UUID)
     - TTL of 5 minutes
     - Status: `pending`

2. **Hub displays code & QR**:
   - Shows readable code (e.g., `K7M4P2Q9`)
   - Shows QR with payload: `babyguardian://pair?token={pairingToken}`
   - Countdown timer
   - "Regenerate" button

3. **Mobile receives code**:
   - Option A: Scan QR → extracts `pairingToken`
   - Option B: Manual input → enters code (case-insensitive)

4. **Mobile claims session**:
   - POST `/pairing/claim` with `code` or `pairingToken`
   - Backend validates and marks as `claimed` (one-time use)
   - Returns `homeId` on success

5. **Hub polls for confirmation**:
   - Every 2-3 seconds: GET `/pairing/sessions/:id`
   - Shows "Successfully linked" when status changes to `claimed`

## Database Schema

### `pairing_sessions` Table

```sql
CREATE TABLE pairing_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(8) UNIQUE NOT NULL,
  pairing_token UUID UNIQUE NOT NULL,
  home_id UUID NOT NULL,
  hub_device_id VARCHAR(255),
  status ENUM ('pending', 'claimed', 'expired', 'cancelled') DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID NOT NULL,
  claimed_by UUID,
  claimed_from_ip VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  INDEX idx_code (code),
  INDEX idx_pairing_token (pairing_token),
  INDEX idx_status_expires_at (status, expires_at),
  INDEX idx_home_id (home_id),
  INDEX idx_created_by (created_by)
);
```

## Backend API

### 1. Create Pairing Session (Hub)

**Endpoint**: `POST /devices/pairing/sessions`  
**Auth**: Bearer token required  
**Body**:
```json
{
  "homeId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "hubDeviceId": "hub-001" // optional
}
```

**Response** (201):
```json
{
  "id": "...",
  "code": "K7M4P2Q9",
  "qrData": "babyguardian://pair?token=...",
  "expiresAt": "2024-04-06T12:05:30Z",
  "status": "pending"
}
```

### 2. Get Session Status (Hub)

**Endpoint**: `GET /devices/pairing/sessions/:sessionId`  
**Auth**: Bearer token required  

**Response** (200):
```json
{
  "status": "pending|claimed|expired|cancelled",
  "claimedBy": "user@example.com",
  "claimedAt": "2024-04-06T12:02:30Z"
}
```

### 3. Cancel Session (Hub)

**Endpoint**: `POST /devices/pairing/sessions/:sessionId/cancel`  
**Auth**: Bearer token required  
**Response**: 200 OK

### 4. Claim Session (Mobile)

**Endpoint**: `POST /devices/pairing/claim`  
**Auth**: Bearer token required  
**Body** (either code or pairingToken):
```json
{
  "code": "K7M4P2Q9"
}
```
or
```json
{
  "pairingToken": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

**Response** (200):
```json
{
  "success": true,
  "homeId": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

**Error Response** (200, but success=false):
```json
{
  "success": false,
  "reason": "Pairing code expired | Invalid pairing code | Pairing code already used"
}
```

## Security Rules

### Code Generation
- **Length**: 8 characters
- **Alphabet**: Base32 without ambiguous characters (0/O, 1/I/l)
- **Pattern**: `[ABCDEFGHJKMNPQRSTUVWXYZ23456789]`

### TTL & Expiration
- **Default TTL**: 5 minutes (configurable)
- **Cleanup**: Expired sessions should be cleaned up via scheduled job
- **Status Transition**: Manual marking when expired (no auto-transition)

### One-Time Use
- **Claim Lock**: `claimed_at NOT NULL` prevents reuse
- **Atomicity**: Single claim succeeds, subsequent attempts fail
- **Audit Trail**: `claimedBy` and `claimedFromIp` recorded

### Rate Limiting
- **Max Attempts**: 10 failed claims per user/IP per 10 minutes
- **Failure Tracking**: Failed attempts create temporary records
- **Status Code**: 429 (Too Many Requests) when limit exceeded

### Permission Checks
- **Create**: Only home owner can create session
- **View Status**: Only session creator or home owner can view
- **Cancel**: Only session creator can cancel
- **Claim**: No owner check (any authenticated user can claim with valid code)

## Functional Rules

### Hub (Tablet)

1. **On Login**:
   - If no paired home detected → PairingScreen required
   - If paired home exists → Skip to Dashboard

2. **Pairing Screen Behavior**:
   - "Generate Code" button initiates `POST /pairing/sessions`
   - Polls session status every 2-3 seconds
   - Shows countdown timer (5 minutes)
   - Auto-transitions to Dashboard when claimed
   - "Regenerate" button resets and creates new session

3. **Session Management**:
   - Each generate creates a new session (old ones auto-expire)
   - Cancel button invalidates current session
   - Prevents multiple active sessions per user

### Mobile

1. **Pairing Check**:
   - On app launch: Check if user has any linked homes
   - If no homes → Show PairingScreen
   - If homes exist → Skip to Dashboard

2. **Claiming Process**:
   - Manual code input: Case-insensitive, validates format before sending
   - QR scan: Extracts `pairingToken` from deep-link
   - Both send to `POST /devices/pairing/claim`
   - On success: Refetch homes list, auto-navigate to Dashboard

3. **Error Handling**:
   - "Código expirado" → Show regenerate hint
   - "Código inválido" → Prompt to check code
   - "Código ya usado" → Suggest hub to generate new one
   - Network errors → Retry with backoff

### Post-Claim

1. **Mobile**:
   - Refetch homes/devices data
   - Cache paired home in local preferences
   - Auto-navigate to Dashboard (no re-pairing prompt)

2. **Hub**:
   - Poll updates status
   - Show confirmation and auto-navigate to Dashboard

## Backwards Compatibility

- Legacy endpoints `/devices/pairing-token`, `/devices/pairing-status/:code`, `/devices/pairing-confirm` remain for backwards compatibility
- New code uses `PairingSession` table exclusively
- Old `InviteToken` table is kept for legacy flows

## Testing

### Unit Tests
- Code generation format
- TTL calculation
- One-time claim validation
- Rate limit counter

### Integration Tests
- Create → Claim happy path
- Expired code claim
- Double claim attempt
- Rate limiting enforcement
- Permission checks

### E2E Tests
- Hub login → generate → mobile claim → dashboard
- QR scan path
- Manual code path
- Timeout scenarios

### Security Tests
- Brute force prevention
- Replay attack prevention
- Invalid code formats
- Permission boundaries

## Configuration

Add to environment or config file:

```typescript
PAIRING_TTL_MINUTES=5           // Session expiration time
PAIRING_CODE_LENGTH=8           // Length of user-friendly code
MAX_FAILED_ATTEMPTS=10          // Failed claim attempts before rate limit
FAILED_ATTEMPTS_WINDOW_MINUTES=10 // Window for rate limiting
```

## Maintenance

### Cleanup Job
Should run periodically (e.g., every 5 minutes) to remove truly expired sessions:

```typescript
async cleanupExpiredSessions() {
  return await pairingSessionsRepository.delete({
    expiresAt: MoreThan(new Date()),
    status: 'pending',
  });
}
```

Schedule via:
- NestJS Task Scheduling (Cron)
- External job runner (e.g., node-cron, Kubernetes CronJob)
- Database triggers

## Future Enhancements

1. **Multi-Hub Support**: Each pairing defines `hubDeviceId` explicitly
2. **Device Linking**: Associate claimed pairing with specific device ID
3. **Depairing**: Owner can "unlink" hub from home (set status to `cancelled`)
4. **Push Notifications**: Notify mobile when hub generates code via FCM
5. **Biometric Confirmation**: Add fingerprint/face verification on claim
6. **Pairing History**: Audit trail of all pairing events per home
