package cl.babyguardian.hub.service

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Manages on-device cry detection using TensorFlow Lite audio model.
 * Processes microphone input in real-time and reports confidence scores.
 */
@Singleton
class CryDetectionManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private var isListening = false

    suspend fun startListening(onCryDetected: suspend (confidence: Float) -> Unit) {
        isListening = true
        // TODO: Initialize TFLite audio model from assets/cry_detector.tflite
        // TODO: Start AudioRecord capture at 16kHz mono
        // TODO: Run inference on 1-second overlapping windows
        // TODO: Call onCryDetected when confidence > threshold
    }

    fun stop() {
        isListening = false
        // TODO: Release AudioRecord and TFLite resources
    }
}
