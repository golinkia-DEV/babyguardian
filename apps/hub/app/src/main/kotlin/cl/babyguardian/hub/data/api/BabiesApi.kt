package cl.babyguardian.hub.data.api

import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path

data class BabyDto(
    val id: String,
    val homeId: String,
    val name: String,
    val birthDate: String? = null,
    val gender: String? = null,
    val photoUrl: String? = null,
)

data class CreateBabyDto(
    val homeId: String,
    val name: String,
    val birthDate: String? = null,
    val gender: String? = null,
)

data class UpdateBabyDto(
    val name: String? = null,
    val birthDate: String? = null,
    val gender: String? = null,
    val photoUrl: String? = null,
)

interface BabiesApi {
    @GET("babies/home/{homeId}")
    suspend fun getByHome(
        @Header("Authorization") authorization: String,
        @Path("homeId") homeId: String,
    ): List<BabyDto>

    @POST("babies")
    suspend fun create(
        @Header("Authorization") authorization: String,
        @Body dto: CreateBabyDto,
    ): BabyDto

    @PATCH("babies/{id}")
    suspend fun update(
        @Header("Authorization") authorization: String,
        @Path("id") id: String,
        @Body dto: UpdateBabyDto,
    ): BabyDto

    @DELETE("babies/{id}")
    suspend fun delete(
        @Header("Authorization") authorization: String,
        @Path("id") id: String,
    ): Unit
}
