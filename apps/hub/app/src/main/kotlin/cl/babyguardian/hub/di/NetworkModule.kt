package cl.babyguardian.hub.di

import cl.babyguardian.hub.BuildConfig
import cl.babyguardian.hub.data.api.AuthApi
import cl.babyguardian.hub.data.api.BabiesApi
import cl.babyguardian.hub.data.api.CamerasApi
import cl.babyguardian.hub.data.api.ConfigApi
import cl.babyguardian.hub.data.api.DevicesApi
import cl.babyguardian.hub.data.api.EventsApi
import cl.babyguardian.hub.data.api.HomesApi
import cl.babyguardian.hub.data.api.SmartDevicesApi
import cl.babyguardian.hub.data.local.HubPreferencesRepository
import cl.babyguardian.hub.data.local.SyncDatabase
import android.content.Context
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.util.concurrent.TimeUnit
import javax.inject.Singleton
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideAuthInterceptor(prefs: HubPreferencesRepository): Interceptor {
        return Interceptor { chain ->
            val response = chain.proceed(chain.request())

            // Si recibe 401 (token expirado), limpiar token y cerrar sesión
            if (response.code == 401) {
                try {
                    runBlocking {
                        prefs.setAccessToken(null)
                    }
                } catch (e: Exception) {
                    // Ignorar errores al limpiar
                }
            }

            response
        }
    }

    @Provides
    @Singleton
    fun provideOkHttp(authInterceptor: Interceptor): OkHttpClient {
        val logging = HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor.Level.BODY
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
        }

        val builder = OkHttpClient.Builder()
            .addInterceptor(logging)
            .addInterceptor(authInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)

        // Accept self-signed certificates in debug builds
        if (BuildConfig.DEBUG) {
            try {
                val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
                    override fun checkClientTrusted(chain: Array<X509Certificate>, authType: String) {}
                    override fun checkServerTrusted(chain: Array<X509Certificate>, authType: String) {}
                    override fun getAcceptedIssuers() = arrayOf<X509Certificate>()
                })

                val sslContext = SSLContext.getInstance("SSL")
                sslContext.init(null, trustAllCerts, SecureRandom())

                builder.sslSocketFactory(sslContext.socketFactory, trustAllCerts[0] as X509TrustManager)
                builder.hostnameVerifier { _, _ -> true }
            } catch (e: Exception) {
                // Fallback if SSL setup fails
            }
        }

        return builder.build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(client: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideAuthApi(retrofit: Retrofit): AuthApi = retrofit.create(AuthApi::class.java)

    @Provides
    @Singleton
    fun provideDevicesApi(retrofit: Retrofit): DevicesApi = retrofit.create(DevicesApi::class.java)

    @Provides
    @Singleton
    fun provideHomesApi(retrofit: Retrofit): HomesApi = retrofit.create(HomesApi::class.java)

    @Provides
    @Singleton
    fun provideEventsApi(retrofit: Retrofit): EventsApi = retrofit.create(EventsApi::class.java)

    @Provides
    @Singleton
    fun provideCamerasApi(retrofit: Retrofit): CamerasApi = retrofit.create(CamerasApi::class.java)

    @Provides
    @Singleton
    fun provideBabiesApi(retrofit: Retrofit): BabiesApi = retrofit.create(BabiesApi::class.java)

    @Provides
    @Singleton
    fun provideSmartDevicesApi(retrofit: Retrofit): SmartDevicesApi = retrofit.create(SmartDevicesApi::class.java)

    @Provides
    @Singleton
    fun provideConfigApi(retrofit: Retrofit): ConfigApi = retrofit.create(ConfigApi::class.java)

    @Provides
    @Singleton
    fun provideSyncDatabase(@ApplicationContext context: Context): SyncDatabase {
        return SyncDatabase.getInstance(context)
    }
}
