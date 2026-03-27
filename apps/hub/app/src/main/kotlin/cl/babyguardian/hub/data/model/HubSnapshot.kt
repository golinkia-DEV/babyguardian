package cl.babyguardian.hub.data.model

data class HubSnapshot(
    val accessToken: String?,
    val pairedHomeId: String?,
    val fcmToken: String?,
)
