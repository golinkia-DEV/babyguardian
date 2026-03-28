package cl.babyguardian.hub.ui

import android.Manifest
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import dagger.hilt.android.AndroidEntryPoint
import cl.babyguardian.hub.hasMonitorForegroundPermissions
import cl.babyguardian.hub.service.BabyMonitorService
import cl.babyguardian.hub.ui.theme.BabyGuardianTheme

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private val monitorPermissionsLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { result ->
        if (result.values.all { it }) {
            startBabyMonitorService()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)

        setContent {
            val isDarkTheme = isSystemInDarkTheme()
            BabyGuardianTheme(darkTheme = isDarkTheme) {
                BabyGuardianRoot()
            }
        }

        ensureBabyMonitorService()
    }

    override fun onResume() {
        super.onResume()
        if (hasMonitorForegroundPermissions()) {
            startBabyMonitorService()
        }
    }

    private fun ensureBabyMonitorService() {
        when {
            hasMonitorForegroundPermissions() -> startBabyMonitorService()
            else -> monitorPermissionsLauncher.launch(
                arrayOf(Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA)
            )
        }
    }

    private fun startBabyMonitorService() {
        val intent = Intent(this, BabyMonitorService::class.java)
        ContextCompat.startForegroundService(this, intent)
    }
}
