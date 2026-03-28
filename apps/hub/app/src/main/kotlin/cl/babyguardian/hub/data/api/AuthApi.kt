package cl.babyguardian.hub.data.api

import cl.babyguardian.hub.data.model.GoogleLoginRequest
import cl.babyguardian.hub.data.model.LoginRequest
import cl.babyguardian.hub.data.model.LoginResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/login")
    suspend fun login(@Body body: LoginRequest): LoginResponse

    @POST("auth/google")
    suspend fun googleLogin(@Body body: GoogleLoginRequest): LoginResponse
}
