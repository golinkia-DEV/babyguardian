package cl.babyguardian.hub.service

import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import timber.log.Timber
import java.io.File
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ModelDownloadManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val httpClient = OkHttpClient()

    suspend fun ensureCryModelPath(): String = withContext(Dispatchers.IO) {
        val modelsDir = File(context.filesDir, "models").apply { mkdirs() }
        val localModel = File(modelsDir, MODEL_FILE_NAME)

        if (localModel.exists() && localModel.length() > MIN_MODEL_SIZE_BYTES) {
            return@withContext localModel.absolutePath
        }

        MODEL_CANDIDATE_URLS.forEach { url ->
            try {
                downloadToFile(url, localModel)
                if (localModel.exists() && localModel.length() > MIN_MODEL_SIZE_BYTES) {
                    Timber.i("Cry model downloaded from $url")
                    return@withContext localModel.absolutePath
                }
            } catch (error: Exception) {
                Timber.w(error, "Cry model download failed for $url")
            }
        }

        Timber.w("Using bundled asset model fallback")
        return@withContext ASSET_FALLBACK_PATH
    }

    private fun downloadToFile(url: String, destination: File) {
        val request = Request.Builder().url(url).build()
        httpClient.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
                throw IllegalStateException("HTTP ${response.code} downloading model")
            }
            val body = response.body ?: throw IllegalStateException("Model response body is empty")
            destination.outputStream().use { output ->
                body.byteStream().copyTo(output)
            }
        }
    }

    companion object {
        const val MODEL_FILE_NAME = "cry_detection.tflite"
        const val ASSET_FALLBACK_PATH = "asset://cry_detection.tflite"
        private const val MIN_MODEL_SIZE_BYTES = 10_000L
        private val MODEL_CANDIDATE_URLS = listOf(
            "https://huggingface.co/ericcbonet/cry_baby_lite/resolve/main/cry_detection.tflite",
            "https://huggingface.co/ericcbonet/cry_baby_lite/resolve/main/model.tflite"
        )
    }
}
