@file:OptIn(ExperimentalMaterial3Api::class)

package cl.babyguardian.hub.ui.screens.whitenoise

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import cl.babyguardian.hub.ui.theme.Turquoise
import cl.babyguardian.hub.ui.theme.WarmAmber

data class SoundOption(
    val id: String,
    val label: String,
    val icon: ImageVector,
    val description: String,
)

@Composable
fun WhiteNoiseScreen(
    onBack: () -> Unit,
) {
    val sounds = listOf(
        SoundOption("white", "Ruido Blanco", Icons.Default.Waves, "El clásico, ideal para recién nacidos"),
        SoundOption("brown", "Ruido Marrón", Icons.Default.Grain, "Más grave, muy relajante"),
        SoundOption("rain", "Lluvia", Icons.Default.WaterDrop, "Suave y constante"),
        SoundOption("ocean", "Mar", Icons.Default.BeachAccess, "Olas suaves"),
        SoundOption("fan", "Ventilador", Icons.Default.Air, "Sonido continuo familiar"),
        SoundOption("heartbeat", "Latido", Icons.Default.Favorite, "Como en el vientre"),
        SoundOption("forest", "Bosque", Icons.Default.Forest, "Pájaros y viento"),
        SoundOption("womb", "Vientre", Icons.Default.ChildCare, "Sonidos intrauterinos"),
    )

    var selectedSound by remember { mutableStateOf<SoundOption?>(null) }
    var isPlaying by remember { mutableStateOf(false) }
    var timerMinutes by remember { mutableStateOf(30) }
    var volume by remember { mutableStateOf(0.5f) }

    val pulseScale by rememberInfiniteTransition(label = "pulse").animateFloat(
        initialValue = 1f, targetValue = 1.05f,
        animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse),
        label = "scale"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Header
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
            }
            Spacer(Modifier.width(8.dp))
            Text(
                "Ruido Blanco y Ambiente",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
        }

        // Sound grid
        Text(
            "Selecciona un sonido",
            style = MaterialTheme.typography.titleMedium,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
        )

        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.height(200.dp)
        ) {
            items(sounds) { sound ->
                val isSelected = selectedSound?.id == sound.id
                Column(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isSelected) Turquoise.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surface)
                        .clickable { selectedSound = sound }
                        .padding(12.dp)
                        .then(if (isSelected) Modifier.scale(pulseScale) else Modifier),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Icon(
                        sound.icon,
                        contentDescription = sound.label,
                        modifier = Modifier.size(28.dp),
                        tint = if (isSelected) Turquoise else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                    Text(
                        sound.label,
                        style = MaterialTheme.typography.labelSmall,
                        color = if (isSelected) Turquoise else MaterialTheme.colorScheme.onSurface,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            }
        }

        // Playback controls
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Play/Stop
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(CircleShape)
                    .background(if (isPlaying) Turquoise else MaterialTheme.colorScheme.surface)
                    .clickable { isPlaying = !isPlaying },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    if (isPlaying) Icons.Default.Stop else Icons.Default.PlayArrow,
                    contentDescription = if (isPlaying) "Detener" else "Reproducir",
                    modifier = Modifier.size(32.dp),
                    tint = if (isPlaying) MaterialTheme.colorScheme.onPrimary else Turquoise
                )
            }

            // Volume slider
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    "Volumen ${(volume * 100).toInt()}%",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                )
                Slider(
                    value = volume,
                    onValueChange = { volume = it },
                    colors = SliderDefaults.colors(thumbColor = Turquoise, activeTrackColor = Turquoise)
                )
            }
        }

        // Timer
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                "Temporizador",
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf(15, 30, 45, 60, 90, 0).forEach { min ->
                    FilterChip(
                        selected = timerMinutes == min,
                        onClick = { timerMinutes = min },
                        label = { Text(if (min == 0) "Inf" else "${min}m") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Turquoise,
                            selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                        )
                    )
                }
            }
        }

        // Status
        if (isPlaying && selectedSound != null) {
            Card(
                colors = CardDefaults.cardColors(containerColor = Turquoise.copy(alpha = 0.1f)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(selectedSound!!.icon, contentDescription = null, tint = Turquoise)
                    Column {
                        Text(
                            "Reproduciendo: ${selectedSound!!.label}",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.SemiBold,
                            color = Turquoise
                        )
                        Text(
                            selectedSound!!.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                        )
                    }
                }
            }
        }
    }
}
