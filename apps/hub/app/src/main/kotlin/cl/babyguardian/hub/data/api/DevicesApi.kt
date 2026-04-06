package cl.babyguardian.hub.data.api

import cl.babyguardian.hub.data.model.CreatePairingSessionRequest
import cl.babyguardian.hub.data.model.PairingConfirmRequest
import cl.babyguardian.hub.data.model.PairingConfirmResponse
import cl.babyguardian.hub.data.model.PairingSessionResponse
import cl.babyguardian.hub.data.model.PairingSessionStatusResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

interface DevicesApi {
    @POST("devices/pairing-confirm")
    suspend fun confirmPairing(
        @Header("Authorization") authorization: String?,
        @Body body: PairingConfirmRequest,
    ): PairingConfirmResponse

    // New hub-first pairing flow
    @POST("devices/pairing/sessions")
    suspend fun createPairingSession(
        @Header("Authorization") authorization: String?,
        @Body body: CreatePairingSessionRequest,
    ): PairingSessionResponse

    @GET("devices/pairing/sessions/{sessionId}")
    suspend fun getPairingSessionStatus(
        @Header("Authorization") authorization: String?,
        @Path("sessionId") sessionId: String,
    ): PairingSessionStatusResponse

    @POST("devices/pairing/sessions/{sessionId}/cancel")
    suspend fun cancelPairingSession(
        @Header("Authorization") authorization: String?,
        @Path("sessionId") sessionId: String,
    ): Unit
}
