package cl.babyguardian.hub.ui.session

import cl.babyguardian.hub.data.model.HubSnapshot

sealed class HubSession {
    object Loading : HubSession()
    object Login : HubSession()
    object NeedsPairing : HubSession()
    data class Ready(val token: String, val homeId: String) : HubSession()

    companion object {
        fun from(snapshot: HubSnapshot): HubSession {
            val token = snapshot.accessToken
            val homeId = snapshot.pairedHomeId
            return when {
                token.isNullOrBlank() -> Login
                homeId.isNullOrBlank() -> NeedsPairing
                else -> Ready(token, homeId)
            }
        }
    }
}
