package cl.babyguardian.hub.ui.screens.dashboard

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import cl.babyguardian.hub.ui.theme.CalmGreen
import cl.babyguardian.hub.ui.theme.SoftRed
import cl.babyguardian.hub.ui.theme.Turquoise
import cl.babyguardian.hub.ui.theme.WarmAmber

enum class BabyState { CALM, RESTLESS, CRYING }

@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel = hiltViewModel(),
    onNavigateToFeeding: () -> Unit,
    onNavigateToWhiteNoise: () -> Unit,
    onNavigateToSettings: () -> Unit,
) {
    val uiState by viewModel.uiState.collectAsState()

    val statusColor by animateColorAsState(
        targetValue = when (uiState.babyState) {
            BabyState.CALM -> CalmGreen
            BabyState.RESTLESS -> WarmAmber
            BabyState.CRYING -> SoftRed
        },
        animationSpec = tween(800),
        label = "statusColor"
    )

    Row(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Camera feed - 70% of screen
        Box(
            modifier = Modifier
                .weight(0.7f)
                .fillMaxHeight()
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black),
                contentAlignment = Alignment.Center
            ) {
                if (uiState.cameraConnected) {
                    // RTSPCameraView() - VLC player composable
                    Text(
                        "Vista de cámara en vivo",
                        color = Color.White,
                        fontSize = 18.sp
                    )
                } else {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Default.VideocamOff,
                            contentDescription = null,
                            tint = Color.Gray,
                            modifier = Modifier.size(64.dp)
                        )
                        Spacer(Modifier.height(8.dp))
                        Text(
                            "Sin cámara conectada",
                            color = Color.Gray,
                            fontSize = 16.sp
                        )
                        Spacer(Modifier.height(16.dp))
                        Button(
                            onClick = onNavigateToSettings,
                            colors = ButtonDefaults.buttonColors(containerColor = Turquoise)
                        ) {
                            Text("Conectar cámara")
                        }
                    }
                }

                // Floating calm button when crying
                if (uiState.babyState == BabyState.CRYING) {
                    FloatingActionButton(
                        onClick = { viewModel.activateWhiteNoise() },
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .padding(bottom = 24.dp),
                        containerColor = Turquoise
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Headphones, contentDescription = null)
                            Spacer(Modifier.width(8.dp))
                            Text("Activar ruido blanco")
                        }
                    }
                }
            }
        }

        // Control panel - 30% of screen
        Column(
            modifier = Modifier
                .weight(0.3f)
                .fillMaxHeight()
                .background(MaterialTheme.colorScheme.surface)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Baby status header
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = uiState.babyName,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = uiState.babyAge,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
                Spacer(Modifier.height(16.dp))

                // Status indicator
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(CircleShape)
                        .background(statusColor.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape)
                            .background(statusColor)
                    )
                }
                Spacer(Modifier.height(8.dp))
                Text(
                    text = when (uiState.babyState) {
                        BabyState.CALM -> "Tranquilo"
                        BabyState.RESTLESS -> "Inquieto"
                        BabyState.CRYING -> "Llorando"
                    },
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.SemiBold,
                    color = statusColor
                )
            }

            // Quick action buttons
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                QuickActionButton(
                    icon = Icons.Default.Headphones,
                    label = "Ruido Blanco",
                    onClick = onNavigateToWhiteNoise,
                    color = Turquoise
                )
                QuickActionButton(
                    icon = Icons.Default.LocalDrink,
                    label = "Registrar Toma",
                    onClick = onNavigateToFeeding,
                    color = WarmAmber
                )
                QuickActionButton(
                    icon = Icons.Default.Settings,
                    label = "Configuración",
                    onClick = onNavigateToSettings,
                    color = MaterialTheme.colorScheme.secondary
                )
            }

            // Last feeding info
            uiState.lastFeeding?.let { feeding ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceVariant
                    )
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            "Ultima toma",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                        Text(
                            feeding.timeAgo,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            "Próxima en ${feeding.nextIn}",
                            style = MaterialTheme.typography.bodySmall,
                            color = Turquoise
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun QuickActionButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    onClick: () -> Unit,
    color: Color
) {
    FilledTonalButton(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = ButtonDefaults.filledTonalButtonColors(
            containerColor = color.copy(alpha = 0.15f),
            contentColor = color
        )
    ) {
        Icon(icon, contentDescription = null, modifier = Modifier.size(20.dp))
        Spacer(Modifier.width(8.dp))
        Text(label, fontWeight = FontWeight.Medium)
    }
}
