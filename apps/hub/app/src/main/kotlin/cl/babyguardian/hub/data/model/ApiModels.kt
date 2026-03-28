package cl.babyguardian.hub.data.model

data class LoginRequest(
    val email: String,
    val password: String,
)

data class GoogleLoginRequest(
    val idToken: String,
)

data class LoginResponse(
    val token: String,
    val user: LoginUserDto?,
)

data class LoginUserDto(
    val id: String?,
    val email: String?,
    val fullName: String?,
)

data class PairingConfirmRequest(
    val code: String,
)

data class PairingConfirmResponse(
    val success: Boolean,
    val homeId: String? = null,
    val reason: String? = null,
)

data class CreateEventRequest(
    val homeId: String,
    val babyId: String? = null,
    val eventType: String,
    val severity: String? = null,
    val confidence: Double? = null,
    val metadata: Map<String, @JvmSuppressWildcards Any>? = null,
)
