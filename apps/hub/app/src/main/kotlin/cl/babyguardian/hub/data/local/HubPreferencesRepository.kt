package cl.babyguardian.hub.data.local

import android.content.Context
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import cl.babyguardian.hub.data.model.HubSnapshot
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.hubDataStore by preferencesDataStore(name = "hub_prefs")

private val ACCESS_TOKEN_KEY = stringPreferencesKey("access_token")
private val PAIRED_HOME_ID_KEY = stringPreferencesKey("paired_home_id")
private val FCM_TOKEN_KEY = stringPreferencesKey("fcm_token")

@Singleton
class HubPreferencesRepository @Inject constructor(
    @ApplicationContext private val context: Context,
) {

    val snapshot: Flow<HubSnapshot> = context.hubDataStore.data.map { prefs ->
        HubSnapshot(
            accessToken = prefs[ACCESS_TOKEN_KEY],
            pairedHomeId = prefs[PAIRED_HOME_ID_KEY],
            fcmToken = prefs[FCM_TOKEN_KEY],
        )
    }

    suspend fun getAccessToken(): String? =
        context.hubDataStore.data.map { it[ACCESS_TOKEN_KEY] }.first()

    suspend fun getPairedHomeId(): String? =
        context.hubDataStore.data.map { it[PAIRED_HOME_ID_KEY] }.first()

    suspend fun setAccessToken(token: String?) {
        context.hubDataStore.edit { prefs ->
            if (token.isNullOrBlank()) prefs.remove(ACCESS_TOKEN_KEY) else prefs[ACCESS_TOKEN_KEY] = token
        }
    }

    suspend fun setPairedHomeId(id: String?) {
        context.hubDataStore.edit { prefs ->
            if (id.isNullOrBlank()) prefs.remove(PAIRED_HOME_ID_KEY) else prefs[PAIRED_HOME_ID_KEY] = id
        }
    }

    suspend fun setFcmToken(token: String?) {
        context.hubDataStore.edit { prefs ->
            if (token.isNullOrBlank()) prefs.remove(FCM_TOKEN_KEY) else prefs[FCM_TOKEN_KEY] = token
        }
    }
}
