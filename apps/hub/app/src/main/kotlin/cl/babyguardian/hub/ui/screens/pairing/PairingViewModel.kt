package cl.babyguardian.hub.ui.screens.pairing

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import cl.babyguardian.hub.BuildConfig
import cl.babyguardian.hub.data.api.DevicesApi
import cl.babyguardian.hub.data.local.HubPreferencesRepository
import cl.babyguardian.hub.data.model.CreatePairingSessionRequest
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PairingUiState(
    val pairingCode: String? = null,
    val qrData: String? = null,
    val sessionId: String? = null,
    val expiresAt: String? = null,
    val isLoading: Boolean = false,
    val isPolling: Boolean = false,
    val error: String? = null,
    val isPaired: Boolean = false,
    val secondsRemaining: Int = 0,
)

@HiltViewModel
class PairingViewModel @Inject constructor(
    private val devicesApi: DevicesApi,
    private val hubPrefs: HubPreferencesRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(PairingUiState())
    val uiState: StateFlow<PairingUiState> = _uiState.asStateFlow()

    private var pollingJob: kotlinx.coroutines.Job? = null

    /**
     * Hub generates a new pairing session
     */
    fun generatePairingCode() {
        val homeId = hubPrefs.getPairedHomeId() ?: run {
            _uiState.update { it.copy(error = "No se encontró el hogar") }
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            try {
                val token = getAuthToken() ?: return@launch
                val res = devicesApi.createPairingSession(
                    "Bearer $token",
                    CreatePairingSessionRequest(homeId),
                )
                _uiState.update {
                    it.copy(
                        pairingCode = res.code,
                        qrData = res.qrData,
                        sessionId = res.id,
                        expiresAt = res.expiresAt,
                        isLoading = false,
                        secondsRemaining = 300, // 5 minutes
                    )
                }
                startCountdown()
                startPolling()
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = e.message ?: "Error al generar código",
                    )
                }
            }
        }
    }

    /**
     * Start countdown timer
     */
    private fun startCountdown() {
        viewModelScope.launch {
            while (_uiState.value.secondsRemaining > 0 && _uiState.value.sessionId != null) {
                delay(1000)
                _uiState.update { it.copy(secondsRemaining = it.secondsRemaining - 1) }
            }
            if (_uiState.value.secondsRemaining <= 0 && _uiState.value.sessionId != null) {
                _uiState.update { it.copy(error = "Código expirado. Genera uno nuevo.") }
                pollingJob?.cancel()
            }
        }
    }

    /**
     * Poll session status every 2-3 seconds
     */
    private fun startPolling() {
        pollingJob?.cancel()
        pollingJob = viewModelScope.launch {
            while (true) {
                delay(2500)
                val sessionId = _uiState.value.sessionId ?: return@launch
                try {
                    val token = getAuthToken() ?: return@launch
                    val status = devicesApi.getPairingSessionStatus("Bearer $token", sessionId)
                    _uiState.update { it.copy(isPolling = false) }

                    when (status.status) {
                        "claimed" -> {
                            _uiState.update {
                                it.copy(
                                    isPaired = true,
                                    isPolling = false,
                                )
                            }
                            pollingJob?.cancel()
                        }
                        "expired", "cancelled" -> {
                            _uiState.update {
                                it.copy(
                                    error = "Sesión ${status.status}",
                                    isPolling = false,
                                )
                            }
                            pollingJob?.cancel()
                        }
                    }
                } catch (e: Exception) {
                    // Continue polling even on error
                    _uiState.update { it.copy(isPolling = false) }
                }
            }
        }
    }

    fun regenerateCode() {
        pollingJob?.cancel()
        _uiState.update {
            it.copy(
                pairingCode = null,
                qrData = null,
                sessionId = null,
                expiresAt = null,
                error = null,
                isPaired = false,
                secondsRemaining = 0,
            )
        }
        generatePairingCode()
    }

    fun cancelSession() {
        val sessionId = _uiState.value.sessionId ?: return
        viewModelScope.launch {
            try {
                val token = getAuthToken() ?: return@launch
                devicesApi.cancelPairingSession("Bearer $token", sessionId)
                pollingJob?.cancel()
                _uiState.update {
                    it.copy(
                        pairingCode = null,
                        qrData = null,
                        sessionId = null,
                        error = null,
                        isPaired = false,
                    )
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(error = e.message ?: "Error al cancelar") }
            }
        }
    }

    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }

    private suspend fun getAuthToken(): String? {
        return if (BuildConfig.DEV_SKIP_AUTH) {
            "DEV_TOKEN"
        } else {
            hubPrefs.getAccessToken() ?: run {
                _uiState.update { it.copy(isLoading = false, error = "Sesión no válida") }
                null
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        pollingJob?.cancel()
    }
}
