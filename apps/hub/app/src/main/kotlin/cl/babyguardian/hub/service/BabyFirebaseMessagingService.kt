package cl.babyguardian.hub.service

import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class BabyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // TODO: Register new FCM token with backend API
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        // Hub receives commands from mobile (e.g., activate white noise remotely)
        when (message.data["type"]) {
            "activate_white_noise" -> {
                // TODO: Start white noise playback
            }
            "request_snapshot" -> {
                // TODO: Capture and upload camera snapshot
            }
        }
    }
}
