package cl.babyguardian.hub.data.api

import cl.babyguardian.hub.data.model.CreateEventRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.Header
import retrofit2.http.POST

interface EventsApi {
    @POST("events")
    suspend fun createEvent(
        @Header("Authorization") authorization: String?,
        @Body body: CreateEventRequest,
    ): Response<Map<String, @JvmSuppressWildcards Any?>>
}
