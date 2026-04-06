package com.babyguardian.mobile.firebase;

import android.util.Log;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

/**
 * Recibe tokens y mensajes FCM. Amplía con registro al backend y notificaciones cuando exista el flujo.
 */
public class BabyGuardianMessagingService extends FirebaseMessagingService {

    private static final String TAG = "BabyGuardianFCM";

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        Log.d(TAG, "onNewToken");
        // TODO: enviar token al backend cuando haya endpoint
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);
        Log.d(TAG, "onMessageReceived from=" + message.getFrom());
        if (message.getNotification() != null) {
            Log.d(TAG, "notification: " + message.getNotification().getBody());
        }
        // TODO: manejar message.getData() (p. ej. acciones como en el Hub)
    }
}
