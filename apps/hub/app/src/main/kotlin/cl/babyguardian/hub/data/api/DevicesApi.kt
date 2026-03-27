package cl.babyguardian.hub.data.api

import cl.babyguardian.hub.data.model.PairingConfirmRequest
import cl.babyguardian.hub.data.model.PairingConfirmResponse
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface DevicesApi {
    @POST("devices/pairing-confirm")
    suspend fun confirmPairing(
        @Header("Authorization") authorization: String,
        @Body body: PairingConfirmRequest,
    ): PairingConfirmResponse
}
