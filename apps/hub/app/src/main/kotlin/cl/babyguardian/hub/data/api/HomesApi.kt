package cl.babyguardian.hub.data.api

import cl.babyguardian.hub.data.model.CreateHomeRequest
import cl.babyguardian.hub.data.model.HomeDto
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface HomesApi {
    @GET("homes/mine")
    suspend fun getMyHomes(@Header("Authorization") authorization: String): List<HomeDto>

    @POST("homes")
    suspend fun createHome(
        @Header("Authorization") authorization: String,
        @Body request: CreateHomeRequest,
    ): HomeDto
}
