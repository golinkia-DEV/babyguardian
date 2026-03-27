package cl.babyguardian.hub

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import dagger.hilt.android.HiltAndroidApp
import timber.log.Timber

@HiltAndroidApp
class BabyGuardianApp : Application() {

    override fun onCreate() {
        super.onCreate()

        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }

        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(NotificationManager::class.java)

            // Foreground service channel
            notificationManager.createNotificationChannel(
                NotificationChannel(
                    CHANNEL_MONITOR,
                    "BabyGuardian Monitor",
                    NotificationManager.IMPORTANCE_LOW
                ).apply { description = "Monitoreo continuo del bebe" }
            )

            // Cry alert channel
            notificationManager.createNotificationChannel(
                NotificationChannel(
                    CHANNEL_CRY_ALERT,
                    "Alerta de Llanto",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Alertas cuando el bebe llora"
                    enableVibration(true)
                    enableLights(true)
                }
            )

            // Security channel
            notificationManager.createNotificationChannel(
                NotificationChannel(
                    CHANNEL_SECURITY,
                    "Alerta de Seguridad",
                    NotificationManager.IMPORTANCE_HIGH
                ).apply {
                    description = "Alertas de seguridad y personas desconocidas"
                    enableVibration(true)
                }
            )
        }
    }

    companion object {
        const val CHANNEL_MONITOR = "channel_monitor"
        const val CHANNEL_CRY_ALERT = "channel_cry_alert"
        const val CHANNEL_SECURITY = "channel_security"
    }
}
