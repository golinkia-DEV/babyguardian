package cl.babyguardian.hub.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import cl.babyguardian.hub.data.local.entity.CachedCameraEntity
import cl.babyguardian.hub.data.local.entity.CachedBabyEntity
import cl.babyguardian.hub.data.local.entity.CachedDeviceEntity
import cl.babyguardian.hub.data.local.entity.OfflineEventEntity
import cl.babyguardian.hub.data.local.entity.PendingStateUpdateEntity
import cl.babyguardian.hub.data.local.dao.CameraDao
import cl.babyguardian.hub.data.local.dao.BabyDao
import cl.babyguardian.hub.data.local.dao.DeviceDao
import cl.babyguardian.hub.data.local.dao.OfflineEventDao
import cl.babyguardian.hub.data.local.dao.PendingStateUpdateDao

@Database(
    entities = [
        CachedCameraEntity::class,
        CachedBabyEntity::class,
        CachedDeviceEntity::class,
        OfflineEventEntity::class,
        PendingStateUpdateEntity::class,
    ],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class SyncDatabase : RoomDatabase() {
    abstract fun cameraDao(): CameraDao
    abstract fun babyDao(): BabyDao
    abstract fun deviceDao(): DeviceDao
    abstract fun offlineEventDao(): OfflineEventDao
    abstract fun pendingStateUpdateDao(): PendingStateUpdateDao

    companion object {
        private var INSTANCE: SyncDatabase? = null

        fun getInstance(context: Context): SyncDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    SyncDatabase::class.java,
                    "sync_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
