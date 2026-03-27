package cl.babyguardian.hub.service

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Handles alert escalation logic:
 * - Debouncing (avoid alert spam)
 * - Severity classification
 * - Push notification dispatch via FCM
 * - Smart device automation triggers (lights, white noise)
 */
@Singleton
class AlertEscalationManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private var lastCryAlertTime = 0L
    private val cryDebounceMs = 30_000L // 30 seconds between cry alerts

    suspend fun onCryDetected(confidence: Float) {
        val now = System.currentTimeMillis()
        if (now - lastCryAlertTime < cryDebounceMs) return

        lastCryAlertTime = now
        // TODO: Send cry_detected event to backend API
        // TODO: Trigger FCM push notification to parent mobile
        // TODO: Trigger smart light automation (warm dim)
    }

    suspend fun onFacesDetected(faces: List<DetectedFace>) {
        val unknownFaces = faces.filter { !it.isAuthorized }
        if (unknownFaces.isNotEmpty()) {
            // TODO: Send security_alert event to backend
            // TODO: Trigger high-priority FCM notification
        }
    }
}
