package cl.babyguardian.hub.service

import timber.log.Timber
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Manages on-device cry detection using TensorFlow Lite audio model.
 * Processes microphone input in real-time and reports confidence scores.
 */
@Singleton
class CryDetectionManager @Inject constructor(
    private val modelDownloadManager: ModelDownloadManager,
) {
    @Suppress("UNUSED_PARAMETER")
    suspend fun startListening(onCryDetected: suspend (confidence: Float) -> Unit) {
        val modelPath = modelDownloadManager.ensureCryModelPath()
        Timber.i("Cry model ready at $modelPath; pipeline TFLite + AudioRecord pendiente")
        // TODO: Inicializar modelo TFLite, AudioRecord 16 kHz mono, ventanas de 1 s y llamar onCryDetected cuando confianza > umbral
        // No invocar onCryDetected hasta tener inferencia real (evita eventos falsos en backend).
    }

    fun stop() {
        // TODO: Liberar AudioRecord y recursos TFLite
    }
}
