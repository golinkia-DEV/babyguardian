package cl.babyguardian.hub.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import cl.babyguardian.hub.ui.navigation.BabyGuardianNavHost
import cl.babyguardian.hub.ui.screens.auth.LoginScreen
import cl.babyguardian.hub.ui.screens.pairing.PairingScreen
import cl.babyguardian.hub.ui.session.HubSession
import cl.babyguardian.hub.ui.session.SessionViewModel

@Composable
fun BabyGuardianRoot(
    sessionViewModel: SessionViewModel = hiltViewModel(),
) {
    val session by sessionViewModel.session.collectAsState()

    when (session) {
        HubSession.Loading -> {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }
        HubSession.Login -> LoginScreen()
        HubSession.NeedsPairing -> PairingScreen()
        is HubSession.Ready -> BabyGuardianNavHost()
    }
}
