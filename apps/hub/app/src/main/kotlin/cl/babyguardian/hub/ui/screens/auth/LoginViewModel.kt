package cl.babyguardian.hub.ui.screens.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import cl.babyguardian.hub.data.api.AuthApi
import cl.babyguardian.hub.data.local.HubPreferencesRepository
import cl.babyguardian.hub.data.model.GoogleLoginRequest
import cl.babyguardian.hub.data.model.LoginRequest
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import retrofit2.HttpException
import javax.inject.Inject

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
)

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authApi: AuthApi,
    private val hubPrefs: HubPreferencesRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun setEmail(value: String) {
        _uiState.update { it.copy(email = value) }
    }

    fun setPassword(value: String) {
        _uiState.update { it.copy(password = value) }
    }

    fun reportGoogleSignInError(message: String) {
        _uiState.update { it.copy(isLoading = false, error = message) }
    }

    fun login() {
        val email = _uiState.value.email.trim()
        val password = _uiState.value.password
        if (email.isBlank() || password.isBlank()) {
            _uiState.update { it.copy(error = "Completa email y contraseña") }
            return
        }
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            try {
                val res = authApi.login(LoginRequest(email, password))
                hubPrefs.setAccessToken(res.token)
                _uiState.update { it.copy(isLoading = false) }
            } catch (e: HttpException) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = "Credenciales inválidas (${e.code()})",
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = e.message ?: "Error de red. ¿API_BASE_URL correcta?",
                    )
                }
            }
        }
    }

    fun loginWithGoogle(idToken: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            try {
                val res = authApi.googleLogin(GoogleLoginRequest(idToken))
                hubPrefs.setAccessToken(res.token)
                _uiState.update { it.copy(isLoading = false) }
            } catch (e: HttpException) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = "No se pudo validar Google (${e.code()}). ¿Mismo GOOGLE_CLIENT_ID que en el servidor?",
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = e.message ?: "Error de red. ¿API_BASE_URL correcta?",
                    )
                }
            }
        }
    }
}
