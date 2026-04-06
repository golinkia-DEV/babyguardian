package cl.babyguardian.hub.data.api

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path

data class CameraDto(
    val id: String,
    val name: String,
    val homeId: String,
    val model: String? = null,
    val serialNumber: String? = null,
    val isActive: Boolean = true,
    val lastSeen: String? = null,
)

data class CreateCameraDto(
    val name: String,
    val homeId: String,
    val model: String? = null,
    val serialNumber: String? = null,
)

interface CamerasApi {
    @GET("cameras/home/{homeId}")
    suspend fun getByHome(
        @Header("Authorization") authorization: String,
        @Path("homeId") homeId: String,
    ): List<CameraDto>

    @POST("cameras")
    suspend fun create(
        @Header("Authorization") authorization: String,
        @Body dto: CreateCameraDto,
    ): CameraDto

    @DELETE("cameras/{id}")
    suspend fun delete(
        @Header("Authorization") authorization: String,
        @Path("id") id: String,
    ): Unit
}
