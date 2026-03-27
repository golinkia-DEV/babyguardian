package cl.babyguardian.hub.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// BabyGuardian Color Palette (neurodiseno para calma parental)
val Turquoise = Color(0xFF00B6C1)
val TurquoiseDark = Color(0xFF009AA4)
val CalmGreen = Color(0xFF90EE90)
val WarmAmber = Color(0xFFFFB84D)
val SoftRed = Color(0xFFFF6B6B)
val NightBlue = Color(0xFF0A0E15)
val SkyBlue = Color(0xFFE9F7FF)
val LightGray = Color(0xFFF9F9F9)

private val DarkColorScheme = darkColorScheme(
    primary = Turquoise,
    onPrimary = Color.White,
    secondary = WarmAmber,
    background = NightBlue,
    surface = Color(0xFF181F2B),
    onBackground = Color(0xFFE0E0E0),
    onSurface = Color(0xFFE0E0E0),
    error = SoftRed,
)

private val LightColorScheme = lightColorScheme(
    primary = Turquoise,
    onPrimary = Color.White,
    secondary = WarmAmber,
    background = LightGray,
    surface = Color.White,
    onBackground = Color(0xFF333333),
    onSurface = Color(0xFF333333),
    surfaceVariant = SkyBlue,
    error = SoftRed,
)

@Composable
fun BabyGuardianTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current

    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.surface.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = BabyGuardianTypography,
        shapes = BabyGuardianShapes,
        content = content
    )
}
