package cl.babyguardian.hub.data.api

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path

data class SmartDeviceDto(
    val id: String,
    val homeId: String,
    val name: String,
    val type: String, // "LIGHT", "THERMOSTAT", "HUMIDIFIER", etc.
    val model: String? = null,
    val isActive: Boolean = true,
    val state: Map<String, Any>? = null,
    val lastSeen: String? = null,
)

data class CreateSmartDeviceDto(
    val homeId: String,
    val name: String,
    val type: String,
    val model: String? = null,
)

data class UpdateSmartDeviceStateDto(
    val state: Map<String, Any>,
)

interface SmartDevicesApi {
    @GET("devices/home/{homeId}")
    suspend fun getByHome(
        @Header("Authorization") authorization: String,
        @Path("homeId") homeId: String,
    ): List<SmartDeviceDto>

    @POST("devices")
    suspend fun create(
        @Header("Authorization") authorization: String,
        @Body dto: CreateSmartDeviceDto,
    ): SmartDeviceDto

    @PATCH("devices/{id}/state")
    suspend fun updateState(
        @Header("Authorization") authorization: String,
        @Path("id") id: String,
        @Body dto: UpdateSmartDeviceStateDto,
    ): SmartDeviceDto

    @DELETE("devices/{id}")
    suspend fun delete(
        @Header("Authorization") authorization: String,
        @Path("id") id: String,
    ): Unit
}
