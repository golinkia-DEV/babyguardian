package cl.babyguardian.hub.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cached_cameras")
data class CachedCameraEntity(
    @PrimaryKey val id: String,
    val homeId: String,
    val name: String,
    val model: String? = null,
    val serialNumber: String? = null,
    val isActive: Boolean = true,
    val lastSeen: String? = null,
    val cachedAt: Long = System.currentTimeMillis(),
)

@Entity(tableName = "cached_babies")
data class CachedBabyEntity(
    @PrimaryKey val id: String,
    val homeId: String,
    val name: String,
    val birthDate: String? = null,
    val gender: String? = null,
    val photoUrl: String? = null,
    val cachedAt: Long = System.currentTimeMillis(),
)

@Entity(tableName = "cached_devices")
data class CachedDeviceEntity(
    @PrimaryKey val id: String,
    val homeId: String,
    val name: String,
    val type: String,
    val model: String? = null,
    val isActive: Boolean = true,
    val state: String? = null, // JSON serialized
    val lastSeen: String? = null,
    val cachedAt: Long = System.currentTimeMillis(),
)

@Entity(tableName = "offline_events")
data class OfflineEventEntity(
    @PrimaryKey val id: String,
    val homeId: String,
    val babyId: String? = null,
    val eventType: String,
    val severity: String? = null,
    val confidence: Double? = null,
    val metadata: String? = null, // JSON serialized
    val timestamp: Long = System.currentTimeMillis(),
    val isSynced: Boolean = false,
    val syncAttempts: Int = 0,
    val lastSyncAttemptAt: Long? = null,
)

@Entity(tableName = "pending_state_updates")
data class PendingStateUpdateEntity(
    @PrimaryKey val id: String,
    val deviceId: String,
    val state: String, // JSON serialized
    val timestamp: Long = System.currentTimeMillis(),
    val isSynced: Boolean = false,
    val syncAttempts: Int = 0,
)
