package cl.babyguardian.hub.service

import cl.babyguardian.hub.BuildConfig
import cl.babyguardian.hub.data.api.EventsApi
import cl.babyguardian.hub.data.local.HubPreferencesRepository
import cl.babyguardian.hub.data.model.CreateEventRequest
import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Handles alert escalation logic:
 * - Debouncing (avoid alert spam)
 * - Severity classification
 * - Reporting events to the backend (FCM to parents is triggered server-side)
 */
@Singleton
class AlertEscalationManager @Inject constructor(
    private val hubPrefs: HubPreferencesRepository,
    private val eventsApi: EventsApi,
) {
    private var lastCryAlertTime = 0L
    private val cryDebounceMs = 30_000L

    suspend fun onCryDetected(confidence: Float) {
        val now = System.currentTimeMillis()
        if (now - lastCryAlertTime < cryDebounceMs) return

        val homeId = hubPrefs.getPairedHomeId() ?: return
        val token = hubPrefs.getAccessToken()
        if (!BuildConfig.DEV_SKIP_AUTH && token.isNullOrBlank()) return

        lastCryAlertTime = now
        try {
            val authHeader = if (BuildConfig.DEV_SKIP_AUTH) null else "Bearer $token"
            val res = eventsApi.createEvent(
                authHeader,
                CreateEventRequest(
                    homeId = homeId,
                    eventType = "cry_detected",
                    severity = if (confidence >= 0.75) "critical" else "warn",
                    confidence = confidence.toDouble(),
                ),
            )
            if (!res.isSuccessful) {
                Timber.w("cry_detected API ${res.code()}")
            }
        } catch (e: Exception) {
            Timber.e(e, "No se pudo enviar cry_detected al backend")
        }
    }

    suspend fun onFacesDetected(faces: List<DetectedFace>) {
        val unknownFaces = faces.filter { !it.isAuthorized }
        if (unknownFaces.isEmpty()) return

        val homeId = hubPrefs.getPairedHomeId() ?: return
        val token = hubPrefs.getAccessToken()
        if (!BuildConfig.DEV_SKIP_AUTH && token.isNullOrBlank()) return

        try {
            val authHeader = if (BuildConfig.DEV_SKIP_AUTH) null else "Bearer $token"
            val res = eventsApi.createEvent(
                authHeader,
                CreateEventRequest(
                    homeId = homeId,
                    eventType = "security_unknown_face",
                    severity = "high",
                    metadata = mapOf("unknownCount" to unknownFaces.size),
                ),
            )
            if (!res.isSuccessful) {
                Timber.w("security_unknown_face API ${res.code()}")
            }
        } catch (e: Exception) {
            Timber.e(e, "No se pudo enviar security_unknown_face al backend")
        }
    }
}
