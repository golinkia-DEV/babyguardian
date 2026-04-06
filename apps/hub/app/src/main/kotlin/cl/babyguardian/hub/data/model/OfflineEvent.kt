package cl.babyguardian.hub.data.model

import java.util.UUID

/**
 * Represents an event that occurred while offline and needs to be synced
 */
data class OfflineEvent(
    val id: String = UUID.randomUUID().toString(),
    val homeId: String,
    val babyId: String? = null,
    val eventType: String,
    val severity: String? = null,
    val confidence: Double? = null,
    val metadata: Map<String, Any>? = null,
    val timestamp: Long = System.currentTimeMillis(),
    val isSynced: Boolean = false,
    val syncAttempts: Int = 0,
    val lastSyncAttemptAt: Long? = null,
)

/**
 * Represents a state change that needs to be synced
 */
data class PendingStateUpdate(
    val id: String = UUID.randomUUID().toString(),
    val deviceId: String,
    val state: Map<String, Any>,
    val timestamp: Long = System.currentTimeMillis(),
    val isSynced: Boolean = false,
    val syncAttempts: Int = 0,
)

/**
 * Sync metadata for tracking sync status
 */
data class SyncMetadata(
    val lastFullSyncAt: Long? = null,
    val lastIncrementalSyncAt: Long? = null,
    val lastEventSyncAt: Long? = null,
    val pendingEventCount: Int = 0,
    val pendingStateUpdateCount: Int = 0,
    val isOnline: Boolean = true,
    val lastOnlineAt: Long? = null,
)
