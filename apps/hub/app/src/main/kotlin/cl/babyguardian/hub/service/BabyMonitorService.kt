package cl.babyguardian.hub.service

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import dagger.hilt.android.AndroidEntryPoint
import cl.babyguardian.hub.BabyGuardianApp
import cl.babyguardian.hub.R
import cl.babyguardian.hub.ui.MainActivity
import kotlinx.coroutines.*
import javax.inject.Inject

/**
 * Core foreground service that runs 24/7 monitoring:
 * - Audio analysis for cry detection (TensorFlow Lite)
 * - Face detection via camera (ML Kit)
 * - Event processing and alert escalation
 * - Smart device automation
 */
@AndroidEntryPoint
class BabyMonitorService : Service() {

    @Inject
    lateinit var cryDetector: CryDetectionManager

    @Inject
    lateinit var faceRecognizer: FaceRecognitionManager

    @Inject
    lateinit var alertManager: AlertEscalationManager

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    override fun onCreate() {
        super.onCreate()
        startForeground(NOTIFICATION_ID, buildForegroundNotification())
        startMonitoring()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY // Restart if killed
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startMonitoring() {
        // Start cry detection in background
        serviceScope.launch {
            cryDetector.startListening { confidence ->
                if (confidence > CRY_THRESHOLD) {
                    alertManager.onCryDetected(confidence)
                }
            }
        }

        // Start face recognition
        serviceScope.launch {
            faceRecognizer.startDetecting { faces ->
                alertManager.onFacesDetected(faces)
            }
        }
    }

    override fun onDestroy() {
        serviceScope.cancel()
        cryDetector.stop()
        faceRecognizer.stop()
        super.onDestroy()
    }

    private fun buildForegroundNotification(): Notification {
        val pendingIntent = PendingIntent.getActivity(
            this, 0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, BabyGuardianApp.CHANNEL_MONITOR)
            .setContentTitle("BabyGuardian activo")
            .setContentText("Monitoreando al bebé...")
            .setSmallIcon(R.drawable.ic_launcher)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    companion object {
        private const val NOTIFICATION_ID = 1001
        private const val CRY_THRESHOLD = 0.75f
    }
}
