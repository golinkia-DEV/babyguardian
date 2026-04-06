package cl.babyguardian.hub.data.api

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.Path

data class HomeDto(
    val id: String,
    val name: String,
    val countryCode: String = "CL",
    val timezone: String = "America/Santiago",
    val ownerId: String,
    val createdAt: String? = null,
    val updatedAt: String? = null,
)

data class HubConfigDto(
    val homeId: String,
    val deviceId: String,
    val settings: Map<String, Any>, // cry_sensitivity, face_detection_enabled, etc.
    val lastSyncAt: String? = null,
)

data class UpdateHomeDto(
    val name: String? = null,
    val countryCode: String? = null,
    val timezone: String? = null,
)

data class UpdateHubConfigDto(
    val settings: Map<String, Any>,
)

interface ConfigApi {
    @GET("homes/{id}")
    suspend fun getHome(
        @Header("Authorization") authorization: String,
        @Path("id") id: String,
    ): HomeDto

    @PATCH("homes/{id}")
    suspend fun updateHome(
        @Header("Authorization") authorization: String,
        @Path("id") id: String,
        @Body dto: UpdateHomeDto,
    ): HomeDto
}
