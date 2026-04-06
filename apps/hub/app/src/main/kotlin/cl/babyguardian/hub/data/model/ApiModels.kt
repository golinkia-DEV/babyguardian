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

data class HomeDto(
    val id: String,
    val name: String? = null,
)

data class PairingConfirmRequest(
    val code: String,
)

data class PairingConfirmResponse(
    val success: Boolean,
    val homeId: String? = null,
    val reason: String? = null,
)

// Pairing Sessions (hub-first flow)
data class CreatePairingSessionRequest(
    val homeId: String,
    val hubDeviceId: String? = null,
)

data class PairingSessionResponse(
    val id: String,
    val code: String,
    val qrData: String,
    val expiresAt: String,
    val status: String,
)

data class PairingSessionStatusResponse(
    val status: String,
    val claimedBy: String? = null,
    val claimedAt: String? = null,
)

data class CreateEventRequest(
    val homeId: String,
    val babyId: String? = null,
    val eventType: String,
    val severity: String? = null,
    val confidence: Double? = null,
    val metadata: Map<String, @JvmSuppressWildcards Any>? = null,
)
