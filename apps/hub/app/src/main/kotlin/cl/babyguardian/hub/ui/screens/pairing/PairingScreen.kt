package cl.babyguardian.hub.ui.screens.pairing

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import cl.babyguardian.hub.ui.theme.CalmGreen
import cl.babyguardian.hub.ui.theme.SoftRed
import cl.babyguardian.hub.ui.theme.Turquoise
import cl.babyguardian.hub.ui.theme.WarmAmber

@Composable
fun PairingScreen(
    viewModel: PairingViewModel = hiltViewModel(),
    onPaired: () -> Unit,
) {
    val uiState by viewModel.uiState.collectAsState()
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseAlpha by infiniteTransition.animateFloat(
        initialValue = 0.3f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse),
        label = "alpha"
    )

    LaunchedEffect(uiState.isPaired) {
        if (uiState.isPaired) onPaired()
    }

    Row(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        horizontalArrangement = Arrangement.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxHeight()
                .widthIn(max = 600.dp)
                .padding(40.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                Icons.Default.TabletAndroid,
                contentDescription = null,
                modifier = Modifier.size(80.dp),
                tint = Turquoise
            )
            Spacer(Modifier.height(24.dp))
            Text(
                "Vincular BabyGuardian Hub",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(Modifier.height(8.dp))
            Text(
                "Escanea el código QR desde la app móvil de BabyGuardian",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
            Spacer(Modifier.height(40.dp))

            when (uiState.status) {
                PairingStatus.WAITING -> {
                    // QR Code placeholder
                    Box(
                        modifier = Modifier
                            .size(220.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .background(Color.White)
                            .border(3.dp, Turquoise, RoundedCornerShape(16.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            Icons.Default.QrCode2,
                            contentDescription = "QR Code",
                            modifier = Modifier.size(180.dp),
                            tint = Color.Black
                        )
                    }

                    Spacer(Modifier.height(24.dp))

                    // Manual code
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(Turquoise.copy(alpha = 0.1f))
                            .padding(horizontal = 32.dp, vertical = 16.dp)
                    ) {
                        Text(
                            "Código manual",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                        )
                        Text(
                            uiState.pairingCode ?: "------",
                            style = MaterialTheme.typography.headlineLarge,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = Turquoise,
                            letterSpacing = 8.sp
                        )
                    }

                    Spacer(Modifier.height(16.dp))

                    // Countdown
                    Row(
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Timer,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = MaterialTheme.colorScheme.onBackground.copy(
                                alpha = if (uiState.countdown < 60) pulseAlpha else 0.6f
                            )
                        )
                        Spacer(Modifier.width(4.dp))
                        Text(
                            "Válido por ${uiState.countdownFormatted}",
                            style = MaterialTheme.typography.bodyMedium,
                            color = if (uiState.countdown < 60) SoftRed
                            else MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                        )
                    }
                }

                PairingStatus.LINKING -> {
                    CircularProgressIndicator(color = Turquoise, modifier = Modifier.size(64.dp))
                    Spacer(Modifier.height(16.dp))
                    Text("Vinculando con la app móvil...", style = MaterialTheme.typography.bodyLarge)
                }

                PairingStatus.SUCCESS -> {
                    Icon(Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(80.dp), tint = CalmGreen)
                    Spacer(Modifier.height(16.dp))
                    Text("¡Vinculado correctamente!", style = MaterialTheme.typography.headlineSmall, color = CalmGreen, fontWeight = FontWeight.Bold)
                }

                PairingStatus.ERROR -> {
                    Icon(Icons.Default.Error, contentDescription = null, modifier = Modifier.size(64.dp), tint = SoftRed)
                    Spacer(Modifier.height(16.dp))
                    Text("Error de vinculación", style = MaterialTheme.typography.bodyLarge, color = SoftRed)
                    Spacer(Modifier.height(8.dp))
                    Button(
                        onClick = { viewModel.generateNewCode() },
                        colors = ButtonDefaults.buttonColors(containerColor = Turquoise)
                    ) { Text("Intentar de nuevo") }
                }

                PairingStatus.EXPIRED -> {
                    Icon(Icons.Default.HourglassEmpty, contentDescription = null, modifier = Modifier.size(64.dp), tint = WarmAmber)
                    Spacer(Modifier.height(16.dp))
                    Text("Código expirado", style = MaterialTheme.typography.bodyLarge, color = WarmAmber)
                    Spacer(Modifier.height(8.dp))
                    Button(
                        onClick = { viewModel.generateNewCode() },
                        colors = ButtonDefaults.buttonColors(containerColor = Turquoise)
                    ) { Text("Generar nuevo código") }
                }
            }
        }
    }
}

enum class PairingStatus { WAITING, LINKING, SUCCESS, ERROR, EXPIRED }
