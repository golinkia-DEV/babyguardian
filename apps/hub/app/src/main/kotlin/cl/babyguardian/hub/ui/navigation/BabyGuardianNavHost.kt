package cl.babyguardian.hub.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import cl.babyguardian.hub.ui.screens.dashboard.DashboardScreen
import cl.babyguardian.hub.ui.screens.pairing.PairingScreen

sealed class Screen(val route: String) {
    object Dashboard : Screen("dashboard")
    object Pairing : Screen("pairing")
    object Feeding : Screen("feeding")
    object WhiteNoise : Screen("white_noise")
    object Settings : Screen("settings")
    object Setup : Screen("setup")
}

@Composable
fun BabyGuardianNavHost(
    navController: NavHostController = rememberNavController(),
    startDestination: String = Screen.Dashboard.route,
) {
    NavHost(
        navController = navController,
        startDestination = startDestination,
    ) {
        composable(Screen.Pairing.route) {
            PairingScreen()
        }

        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onNavigateToFeeding = { navController.navigate(Screen.Feeding.route) },
                onNavigateToWhiteNoise = { navController.navigate(Screen.WhiteNoise.route) },
                onNavigateToSettings = { navController.navigate(Screen.Settings.route) },
            )
        }

        composable(Screen.Feeding.route) {
            // FeedingScreen()
        }

        composable(Screen.WhiteNoise.route) {
            // WhiteNoiseScreen()
        }

        composable(Screen.Settings.route) {
            // SettingsScreen()
        }

        composable(Screen.Setup.route) {
            // SetupScreen()
        }
    }
}
