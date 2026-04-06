package cl.babyguardian.hub.service

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import androidx.core.content.getSystemService
import cl.babyguardian.hub.data.api.BabiesApi
import cl.babyguardian.hub.data.api.CamerasApi
import cl.babyguardian.hub.data.api.ConfigApi
import cl.babyguardian.hub.data.api.EventsApi
import cl.babyguardian.hub.data.api.SmartDevicesApi
import cl.babyguardian.hub.data.local.SyncDatabase
import cl.babyguardian.hub.data.local.entity.OfflineEventEntity
import cl.babyguardian.hub.data.local.entity.PendingStateUpdateEntity
import cl.babyguardian.hub.data.model.CreateEventRequest
import com.google.gson.Gson
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Central synchronization manager for Hub
 * Handles:
 * - Full sync (homes, cameras, babies, devices)
 * - Incremental sync
 * - Offline event queuing
 * - State change persistence
 * - Retry logic
 */
@Singleton
class HubSyncManager @Inject constructor(
    @ApplicationContext private val context: Context,
    private val camerasApi: CamerasApi,
    private val babiesApi: BabiesApi,
    private val devicesApi: SmartDevicesApi,
    private val configApi: ConfigApi,
    private val eventsApi: EventsApi,
    private val database: SyncDatabase,
) {

    private val syncScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val gson = Gson()

    private val _syncState = MutableStateFlow(SyncState())
    val syncState: StateFlow<SyncState> = _syncState

    private val connectivityManager = context.getSystemService<ConnectivityManager>()

    init {
        syncScope.launch {
            // Monitor connectivity changes
            while (true) {
                val isOnline = isNetworkAvailable()
                _syncState.emit(syncState.value.copy(isOnline = isOnline))

                // If we came back online, sync pending data
                if (isOnline && !syncState.value.isOnline) {
                    performFullSync()
                    syncPendingEvents()
                    syncPendingStateUpdates()
                }

                kotlinx.coroutines.delay(5000) // Check every 5 seconds
            }
        }
    }

    /**
     * Full sync: cameras, babies, devices, configuration
     */
    suspend fun performFullSync(homeId: String?, token: String?) {
        if (!isNetworkAvailable()) {
            Timber.w("Cannot sync: no network connection")
            return
        }

        try {
            _syncState.emit(syncState.value.copy(isSyncing = true, lastError = null))

            homeId?.let { hId ->
                token?.let { t ->
                    syncCameras(hId, t)
                    syncBabies(hId, t)
                    syncDevices(hId, t)
                }
            }

            _syncState.emit(
                syncState.value.copy(
                    isSyncing = false,
                    lastFullSyncAt = System.currentTimeMillis()
                )
            )
        } catch (e: Exception) {
            Timber.e(e, "Full sync failed")
            _syncState.emit(syncState.value.copy(isSyncing = false, lastError = e.message))
        }
    }

    /**
     * Sync cameras for a home
     */
    private suspend fun syncCameras(homeId: String, token: String) {
        try {
            val cameras = camerasApi.getByHome("Bearer $token", homeId)
            val entities = cameras.map { camera ->
                cl.babyguardian.hub.data.local.entity.CachedCameraEntity(
                    id = camera.id,
                    homeId = camera.homeId,
                    name = camera.name,
                    model = camera.model,
                    serialNumber = camera.serialNumber,
                    isActive = camera.isActive,
                    lastSeen = camera.lastSeen,
                )
            }
            database.cameraDao().insertAll(entities)
            Timber.d("Synced ${cameras.size} cameras for home $homeId")
        } catch (e: Exception) {
            Timber.e(e, "Failed to sync cameras")
            throw e
        }
    }

    /**
     * Sync babies for a home
     */
    private suspend fun syncBabies(homeId: String, token: String) {
        try {
            val babies = babiesApi.getByHome("Bearer $token", homeId)
            val entities = babies.map { baby ->
                cl.babyguardian.hub.data.local.entity.CachedBabyEntity(
                    id = baby.id,
                    homeId = baby.homeId,
                    name = baby.name,
                    birthDate = baby.birthDate,
                    gender = baby.gender,
                    photoUrl = baby.photoUrl,
                )
            }
            database.babyDao().insertAll(entities)
            Timber.d("Synced ${babies.size} babies for home $homeId")
        } catch (e: Exception) {
            Timber.e(e, "Failed to sync babies")
            throw e
        }
    }

    /**
     * Sync smart devices for a home
     */
    private suspend fun syncDevices(homeId: String, token: String) {
        try {
            val devices = devicesApi.getByHome("Bearer $token", homeId)
            val entities = devices.map { device ->
                cl.babyguardian.hub.data.local.entity.CachedDeviceEntity(
                    id = device.id,
                    homeId = device.homeId,
                    name = device.name,
                    type = device.type,
                    model = device.model,
                    isActive = device.isActive,
                    state = device.state?.let { gson.toJson(it) },
                    lastSeen = device.lastSeen,
                )
            }
            database.deviceDao().insertAll(entities)
            Timber.d("Synced ${devices.size} devices for home $homeId")
        } catch (e: Exception) {
            Timber.e(e, "Failed to sync devices")
            throw e
        }
    }

    /**
     * Queue an event when online or offline
     */
    suspend fun queueEvent(event: CreateEventRequest, token: String?) {
        try {
            if (isNetworkAvailable() && token != null) {
                // Try to send immediately
                try {
                    eventsApi.createEvent("Bearer $token", event)
                    Timber.d("Event sent immediately: ${event.eventType}")
                } catch (e: Exception) {
                    Timber.w(e, "Failed to send event, queueing for later")
                    queueOfflineEvent(event)
                }
            } else {
                // Queue for later
                queueOfflineEvent(event)
            }
        } catch (e: Exception) {
            Timber.e(e, "Error queuing event")
        }
    }

    /**
     * Queue state update (device control)
     */
    suspend fun queueStateUpdate(deviceId: String, state: Map<String, Any>, token: String?) {
        val entity = PendingStateUpdateEntity(
            deviceId = deviceId,
            state = gson.toJson(state),
        )
        database.pendingStateUpdateDao().insert(entity)
        Timber.d("Queued state update for device $deviceId")

        // Try to sync immediately if online
        if (isNetworkAvailable() && token != null) {
            syncPendingStateUpdates(token)
        }
    }

    /**
     * Sync pending events to server
     */
    private suspend fun syncPendingEvents(token: String? = null) {
        if (token == null || !isNetworkAvailable()) return

        try {
            val unsyncedEvents = database.offlineEventDao().getUnsyncedEvents()
            if (unsyncedEvents.isEmpty()) return

            Timber.d("Syncing ${unsyncedEvents.size} pending events")

            for (eventEntity in unsyncedEvents) {
                try {
                    val metadata = eventEntity.metadata?.let {
                        gson.fromJson(it, Map::class.java) as? Map<String, Any>
                    }
                    val request = CreateEventRequest(
                        homeId = eventEntity.homeId,
                        babyId = eventEntity.babyId,
                        eventType = eventEntity.eventType,
                        severity = eventEntity.severity,
                        confidence = eventEntity.confidence,
                        metadata = metadata,
                    )
                    eventsApi.createEvent("Bearer $token", request)

                    // Mark as synced
                    database.offlineEventDao().update(
                        eventEntity.copy(isSynced = true, syncAttempts = eventEntity.syncAttempts + 1)
                    )
                    Timber.d("Synced pending event: ${eventEntity.id}")
                } catch (e: Exception) {
                    // Update sync attempt count
                    database.offlineEventDao().update(
                        eventEntity.copy(
                            syncAttempts = eventEntity.syncAttempts + 1,
                            lastSyncAttemptAt = System.currentTimeMillis()
                        )
                    )
                    Timber.w(e, "Failed to sync pending event: ${eventEntity.id}")
                }
            }

            // Clean up old synced events (older than 7 days)
            val sevenDaysAgo = System.currentTimeMillis() - (7 * 24 * 60 * 60 * 1000)
            database.offlineEventDao().deleteOldSyncedEvents(sevenDaysAgo)
        } catch (e: Exception) {
            Timber.e(e, "Error syncing pending events")
        }
    }

    /**
     * Sync pending state updates to server
     */
    private suspend fun syncPendingStateUpdates(token: String? = null) {
        if (token == null || !isNetworkAvailable()) return

        try {
            val unsyncedUpdates = database.pendingStateUpdateDao().getUnsyncedUpdates()
            if (unsyncedUpdates.isEmpty()) return

            Timber.d("Syncing ${unsyncedUpdates.size} pending state updates")

            for (updateEntity in unsyncedUpdates) {
                try {
                    @Suppress("UNCHECKED_CAST")
                    val state = gson.fromJson(updateEntity.state, Map::class.java) as Map<String, Any>
                    devicesApi.updateState(
                        "Bearer $token",
                        updateEntity.deviceId,
                        cl.babyguardian.hub.data.api.UpdateSmartDeviceStateDto(state)
                    )

                    // Mark as synced
                    database.pendingStateUpdateDao().update(
                        updateEntity.copy(isSynced = true, syncAttempts = updateEntity.syncAttempts + 1)
                    )
                    Timber.d("Synced state update for device: ${updateEntity.deviceId}")
                } catch (e: Exception) {
                    // Update sync attempt count
                    database.pendingStateUpdateDao().update(
                        updateEntity.copy(
                            syncAttempts = updateEntity.syncAttempts + 1
                        )
                    )
                    Timber.w(e, "Failed to sync state update for device: ${updateEntity.deviceId}")
                }
            }

            // Clean up old synced updates (older than 7 days)
            val sevenDaysAgo = System.currentTimeMillis() - (7 * 24 * 60 * 60 * 1000)
            database.pendingStateUpdateDao().deleteOldSyncedUpdates(sevenDaysAgo)
        } catch (e: Exception) {
            Timber.e(e, "Error syncing pending state updates")
        }
    }

    /**
     * Queue an offline event
     */
    private suspend fun queueOfflineEvent(event: CreateEventRequest) {
        val entity = OfflineEventEntity(
            homeId = event.homeId,
            babyId = event.babyId,
            eventType = event.eventType,
            severity = event.severity,
            confidence = event.confidence,
            metadata = event.metadata?.let { gson.toJson(it) },
        )
        database.offlineEventDao().insert(entity)
        Timber.d("Queued offline event: ${event.eventType}")
    }

    /**
     * Check if network is available
     */
    private fun isNetworkAvailable(): Boolean {
        val network = connectivityManager?.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false

        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    data class SyncState(
        val isSyncing: Boolean = false,
        val isOnline: Boolean = true,
        val lastFullSyncAt: Long? = null,
        val lastIncrementalSyncAt: Long? = null,
        val pendingEventCount: Int = 0,
        val pendingStateUpdateCount: Int = 0,
        val lastError: String? = null,
    )
}
