package cl.babyguardian.hub.ui.session

import cl.babyguardian.hub.data.model.HubSnapshot

sealed class HubSession {
    object Loading : HubSession()
    object Login : HubSession()
    object NeedsPairing : HubSession()
    data class Ready(val token: String, val homeId: String) : HubSession()

    companion object {
        /** Si [devSkipAuth] (solo debug Hub), se considera sesión iniciada sin token; el backend debe usar AUTH_DEV_BYPASS. */
        fun from(snapshot: HubSnapshot, devSkipAuth: Boolean): HubSession {
            val token = snapshot.accessToken
            val homeId = snapshot.pairedHomeId
            val authed = !token.isNullOrBlank() || devSkipAuth
            return when {
                !authed -> Login
                homeId.isNullOrBlank() -> NeedsPairing
                else -> Ready(token.orEmpty(), homeId)
            }
        }
    }
}
