package cl.babyguardian.hub.ui.screens.pairing

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import cl.babyguardian.hub.data.api.DevicesApi
import cl.babyguardian.hub.data.local.HubPreferencesRepository
import cl.babyguardian.hub.data.model.PairingConfirmRequest
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PairingUiState(
    val codeInput: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val isPaired: Boolean = false,
)

@HiltViewModel
class PairingViewModel @Inject constructor(
    private val devicesApi: DevicesApi,
    private val hubPrefs: HubPreferencesRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(PairingUiState())
    val uiState: StateFlow<PairingUiState> = _uiState.asStateFlow()

    fun setCode(value: String) {
        _uiState.update { it.copy(codeInput = value.uppercase().filter { ch -> ch.isLetterOrDigit() }) }
    }

    fun submitPairing() {
        val code = _uiState.value.codeInput.trim()
        if (code.length < 4) {
            _uiState.update { it.copy(error = "Introduce el código que muestra la app móvil") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            try {
                val token = hubPrefs.getAccessToken()
                    ?: run {
                        _uiState.update { it.copy(isLoading = false, error = "Sesión no válida") }
                        return@launch
                    }
                val res = devicesApi.confirmPairing(
                    "Bearer $token",
                    PairingConfirmRequest(code),
                )
                if (res.success && !res.homeId.isNullOrBlank()) {
                    hubPrefs.setPairedHomeId(res.homeId)
                    _uiState.update { it.copy(isLoading = false, isPaired = true) }
                } else {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = res.reason ?: "No se pudo vincular",
                        )
                    }
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = e.message ?: "Error de red",
                    )
                }
            }
        }
    }

    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
}
