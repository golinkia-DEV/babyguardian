package cl.babyguardian.hub.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.core.view.WindowCompat
import dagger.hilt.android.AndroidEntryPoint
import cl.babyguardian.hub.ui.theme.BabyGuardianTheme
import cl.babyguardian.hub.ui.BabyGuardianRoot

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)

        setContent {
            val isDarkTheme = isSystemInDarkTheme()
            BabyGuardianTheme(darkTheme = isDarkTheme) {
                BabyGuardianRoot()
            }
        }
    }
}
