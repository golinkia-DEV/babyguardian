package cl.babyguardian.hub.service

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import timber.log.Timber
import cl.babyguardian.hub.data.local.HubPreferencesRepository
import javax.inject.Inject

@AndroidEntryPoint
class BabyFirebaseMessagingService : FirebaseMessagingService() {

    @Inject
    lateinit var hubPrefs: HubPreferencesRepository

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        scope.launch {
            try {
                hubPrefs.setFcmToken(token)
                Timber.i("FCM token guardado localmente; registro en backend pendiente cuando exista el endpoint")
            } catch (e: Exception) {
                Timber.e(e, "No se pudo guardar FCM token")
            }
        }
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        when (message.data["type"]) {
            "activate_white_noise" -> {
                Timber.i("FCM: activate_white_noise (integrar con servicio de audio / BabyMonitorService)")
            }
            "request_snapshot" -> {
                Timber.i("FCM: request_snapshot (integrar captura de cámara)")
            }
        }
    }
}
