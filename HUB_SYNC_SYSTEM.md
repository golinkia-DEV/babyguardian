# Hub Synchronization System

## Overview

Complete synchronization system for the Hub Android app that ensures all data is synchronized with the backend server and handles offline scenarios gracefully.

## Architecture

### Components

#### 1. **APIs** (`data/api/`)
Extended set of Retrofit interfaces for all Hub data:

- **CamerasApi**: Fetch, create, delete cameras from home
- **BabiesApi**: Manage babies (CRUD operations)
- **SmartDevicesApi**: Control and sync smart devices (lights, thermostats, etc.)
- **ConfigApi**: Home configuration and metadata
- **EventsApi**: Send events to backend (already existed)

#### 2. **Local Storage** (`data/local/`)

**SyncDatabase**: Room database that caches:
- `cached_cameras` — Camera list for each home
- `cached_babies` — Baby profiles
- `cached_devices` — Smart device states
- `offline_events` — Events queued while offline
- `pending_state_updates` — Device state changes queued while offline

**Converters**: Serialize/deserialize complex objects to JSON for Room

#### 3. **HubSyncManager** (`service/HubSyncManager.kt`)

Central orchestration service that:

**Synchronization**
- `performFullSync()` — Sync cameras, babies, devices, config
- `syncCameras()` — Fetch latest cameras for a home
- `syncBabies()` — Fetch latest babies for a home
- `syncDevices()` — Fetch latest smart devices for a home

**Offline Queuing**
- `queueEvent()` — Queue or send events (cry detected, unknown face, etc.)
- `queueStateUpdate()` — Queue device state changes
- `queueOfflineEvent()` — Persist events when offline
- `syncPendingEvents()` — Retry syncing queued events when back online
- `syncPendingStateUpdates()` — Retry syncing device control commands

**Connectivity**
- Monitors network changes
- Auto-triggers full sync when connection restored
- Retries pending operations

**State Tracking**
```kotlin
data class SyncState(
    val isSyncing: Boolean,
    val isOnline: Boolean,
    val lastFullSyncAt: Long?,
    val lastIncrementalSyncAt: Long?,
    val pendingEventCount: Int,
    val pendingStateUpdateCount: Int,
    val lastError: String?,
)
```

#### 4. **Integration with Existing Services**

**AlertEscalationManager**: Updated to use HubSyncManager
- `onCryDetected()` — Queues cry detection events
- `onFacesDetected()` — Queues unknown face alerts
- Events are queued and synced automatically

## Data Flow

### Online Event Flow
```
CryDetectionManager → AlertEscalationManager 
  → syncManager.queueEvent() 
  → EventsApi.createEvent() (immediate)
  ✓ Event sent to backend
```

### Offline Event Flow
```
CryDetectionManager → AlertEscalationManager 
  → syncManager.queueEvent() 
  → (no network) 
  → queueOfflineEvent() 
  → Store in offline_events table
  ✓ Persisted locally

(When online)
  → syncPendingEvents() 
  → EventsApi.createEvent() (retry)
  → Mark as synced or update retry count
```

### Full Sync Trigger Points
1. **Automatic**: On app startup
2. **Manual**: User triggered refresh
3. **Connectivity**: When network connection restored
4. **Periodic**: Optional background sync (every 30 min)

### Device State Control
```
User toggles light on app
  → queueStateUpdate(deviceId, {"on": true})
  → SmartDevicesApi.updateState() (if online)
  → Store in pending_state_updates (if offline)
  ✓ Control queued and synced

(When online)
  → syncPendingStateUpdates()
  → Retry all pending controls
  → Mark as synced
```

## Key Features

### Resilience
- **Offline Queue**: Events persist locally when offline
- **Retry Logic**: Failed events/updates retry up to 3 times (configurable)
- **Cleanup**: Old synced data deleted after 7 days
- **Network Detection**: Monitors connectivity and auto-triggers sync

### Data Consistency
- **Local Cache**: Always has latest data even if offline
- **Timestamp Tracking**: Knows when last sync occurred
- **Conflict Resolution**: Server-side is source of truth
- **Sync Metadata**: Tracks sync state and errors

### Performance
- **Differential Sync**: Only fetches changed data
- **Batch Operations**: Inserts multiple records at once
- **Async**: All network/DB operations on IO thread
- **Cached Reads**: UI can read from local cache while syncing

## Integration Points

### DI/Hilt
```kotlin
// NetworkModule provides:
- CamerasApi, BabiesApi, SmartDevicesApi, ConfigApi
- SyncDatabase
- HubSyncManager (singleton)
```

### Usage in ViewModels/Services
```kotlin
class DashboardViewModel @Inject constructor(
    private val syncManager: HubSyncManager,
    private val database: SyncDatabase,
) {
    fun loadCameras(homeId: String) {
        // Subscribe to cached cameras (live updates)
        database.cameraDao().getByHome(homeId).collect { cameras ->
            _cameras.value = cameras
        }
        
        // Trigger background sync
        viewModelScope.launch {
            syncManager.performFullSync(homeId, token)
        }
    }
}
```

## Configuration

Current hardcoded values (can be made configurable):
- Offline queue retention: 7 days
- Retry attempts: 3 attempts before giving up
- Network check interval: 5 seconds
- Cry detection debounce: 30 seconds

## Future Enhancements

1. **Push Sync Triggers**: Use FCM to trigger sync from server
2. **Differential Sync**: Only sync changed fields
3. **Compression**: Compress large sync payloads
4. **Bandwidth Optimization**: Delta sync for large lists
5. **Conflict Resolution**: Handle concurrent updates gracefully
6. **Analytics**: Track sync success rate, latency, failures
7. **Smart Batching**: Batch multiple state updates in one request
