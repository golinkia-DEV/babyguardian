package cl.babyguardian.hub.data.local.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import cl.babyguardian.hub.data.local.entity.CachedCameraEntity
import cl.babyguardian.hub.data.local.entity.CachedBabyEntity
import cl.babyguardian.hub.data.local.entity.CachedDeviceEntity
import cl.babyguardian.hub.data.local.entity.OfflineEventEntity
import cl.babyguardian.hub.data.local.entity.PendingStateUpdateEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CameraDao {
    @Query("SELECT * FROM cached_cameras WHERE homeId = :homeId")
    fun getByHome(homeId: String): Flow<List<CachedCameraEntity>>

    @Query("SELECT * FROM cached_cameras WHERE id = :id")
    suspend fun getById(id: String): CachedCameraEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(camera: CachedCameraEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(cameras: List<CachedCameraEntity>)

    @Update
    suspend fun update(camera: CachedCameraEntity)

    @Delete
    suspend fun delete(camera: CachedCameraEntity)

    @Query("DELETE FROM cached_cameras WHERE homeId = :homeId")
    suspend fun deleteByHome(homeId: String)
}

@Dao
interface BabyDao {
    @Query("SELECT * FROM cached_babies WHERE homeId = :homeId")
    fun getByHome(homeId: String): Flow<List<CachedBabyEntity>>

    @Query("SELECT * FROM cached_babies WHERE id = :id")
    suspend fun getById(id: String): CachedBabyEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(baby: CachedBabyEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(babies: List<CachedBabyEntity>)

    @Update
    suspend fun update(baby: CachedBabyEntity)

    @Delete
    suspend fun delete(baby: CachedBabyEntity)

    @Query("DELETE FROM cached_babies WHERE homeId = :homeId")
    suspend fun deleteByHome(homeId: String)
}

@Dao
interface DeviceDao {
    @Query("SELECT * FROM cached_devices WHERE homeId = :homeId")
    fun getByHome(homeId: String): Flow<List<CachedDeviceEntity>>

    @Query("SELECT * FROM cached_devices WHERE id = :id")
    suspend fun getById(id: String): CachedDeviceEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(device: CachedDeviceEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(devices: List<CachedDeviceEntity>)

    @Update
    suspend fun update(device: CachedDeviceEntity)

    @Delete
    suspend fun delete(device: CachedDeviceEntity)

    @Query("DELETE FROM cached_devices WHERE homeId = :homeId")
    suspend fun deleteByHome(homeId: String)
}

@Dao
interface OfflineEventDao {
    @Query("SELECT * FROM offline_events WHERE isSynced = 0 ORDER BY timestamp ASC")
    suspend fun getUnsyncedEvents(): List<OfflineEventEntity>

    @Query("SELECT COUNT(*) FROM offline_events WHERE isSynced = 0")
    fun getUnsyncedEventCount(): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(event: OfflineEventEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(events: List<OfflineEventEntity>)

    @Update
    suspend fun update(event: OfflineEventEntity)

    @Query("DELETE FROM offline_events WHERE isSynced = 1 AND timestamp < :olderThanMs")
    suspend fun deleteOldSyncedEvents(olderThanMs: Long)

    @Query("DELETE FROM offline_events WHERE id = :id")
    suspend fun deleteById(id: String)
}

@Dao
interface PendingStateUpdateDao {
    @Query("SELECT * FROM pending_state_updates WHERE isSynced = 0 ORDER BY timestamp ASC")
    suspend fun getUnsyncedUpdates(): List<PendingStateUpdateEntity>

    @Query("SELECT COUNT(*) FROM pending_state_updates WHERE isSynced = 0")
    fun getUnsyncedUpdateCount(): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(update: PendingStateUpdateEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(updates: List<PendingStateUpdateEntity>)

    @Update
    suspend fun update(update: PendingStateUpdateEntity)

    @Query("DELETE FROM pending_state_updates WHERE isSynced = 1 AND timestamp < :olderThanMs")
    suspend fun deleteOldSyncedUpdates(olderThanMs: Long)

    @Query("DELETE FROM pending_state_updates WHERE id = :id")
    suspend fun deleteById(id: String)
}
