package cl.babyguardian.hub.ui.screens.alerts

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import cl.babyguardian.hub.ui.theme.CalmGreen
import cl.babyguardian.hub.ui.theme.SoftRed
import cl.babyguardian.hub.ui.theme.Turquoise
import cl.babyguardian.hub.ui.theme.WarmAmber

enum class AlertSeverity { INFO, WARNING, CRITICAL }

data class AlertItem(
    val id: String,
    val type: String,
    val title: String,
    val subtitle: String,
    val severity: AlertSeverity,
    val timeAgo: String,
    val acknowledged: Boolean = false,
)

@Composable
fun AlertsScreen(onBack: () -> Unit) {
    val alerts = remember {
        listOf(
            AlertItem("1", "cry", "Llanto detectado", "Duración: 2 min 30s", AlertSeverity.WARNING, "Hace 15min", true),
            AlertItem("2", "person", "Mamá detectada", "Confianza: 94% · Cámara principal", AlertSeverity.INFO, "Hace 18min", true),
            AlertItem("3", "cry", "Llanto detectado", "Sin atención por 3 minutos", AlertSeverity.CRITICAL, "Hace 1h", true),
            AlertItem("4", "unknown", "Persona desconocida", "No autorizada · Cámara puerta", AlertSeverity.CRITICAL, "Hace 2h", true),
            AlertItem("5", "motion", "Movimiento detectado", "Cámara principal", AlertSeverity.INFO, "Hace 3h", true),
            AlertItem("6", "offline", "Cámara desconectada", "Cámara principal · 45 seg offline", AlertSeverity.WARNING, "Hace 4h", true),
        )
    }

    var selectedFilter by remember { mutableStateOf<AlertSeverity?>(null) }

    val filtered = alerts.filter { selectedFilter == null || it.severity == selectedFilter }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Header
        Row(
            modifier = Modifier.padding(start = 8.dp, end = 16.dp, top = 16.dp, bottom = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
            }
            Text(
                "Historial de alertas",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.weight(1f)
            )
            IconButton(onClick = { /* clear all */ }) {
                Icon(Icons.Default.ClearAll, contentDescription = "Limpiar")
            }
        }

        // Filter chips
        Row(
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            FilterChip(
                selected = selectedFilter == null,
                onClick = { selectedFilter = null },
                label = { Text("Todas") }
            )
            FilterChip(
                selected = selectedFilter == AlertSeverity.CRITICAL,
                onClick = { selectedFilter = if (selectedFilter == AlertSeverity.CRITICAL) null else AlertSeverity.CRITICAL },
                label = { Text("Críticas") },
                colors = FilterChipDefaults.filterChipColors(selectedContainerColor = SoftRed, selectedLabelColor = Color.White)
            )
            FilterChip(
                selected = selectedFilter == AlertSeverity.WARNING,
                onClick = { selectedFilter = if (selectedFilter == AlertSeverity.WARNING) null else AlertSeverity.WARNING },
                label = { Text("Aviso") },
                colors = FilterChipDefaults.filterChipColors(selectedContainerColor = WarmAmber, selectedLabelColor = Color.White)
            )
        }

        LazyColumn(
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(filtered) { alert ->
                AlertCard(alert = alert)
            }
        }
    }
}

@Composable
private fun AlertCard(alert: AlertItem) {
    val (bgColor, iconTint, _) = when (alert.severity) {
        AlertSeverity.CRITICAL -> Triple(SoftRed.copy(alpha = 0.08f), SoftRed, Icons.Default.Error)
        AlertSeverity.WARNING -> Triple(WarmAmber.copy(alpha = 0.08f), WarmAmber, Icons.Default.Warning)
        AlertSeverity.INFO -> Triple(Turquoise.copy(alpha = 0.08f), Turquoise, Icons.Default.Info)
    }

    val typeIcon: ImageVector = when (alert.type) {
        "cry" -> Icons.Default.RecordVoiceOver
        "person" -> Icons.Default.Person
        "unknown" -> Icons.Default.PersonOff
        "motion" -> Icons.Default.DirectionsWalk
        "offline" -> Icons.Default.VideocamOff
        else -> Icons.Default.Notifications
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = bgColor),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(iconTint.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(typeIcon, contentDescription = null, tint = iconTint, modifier = Modifier.size(22.dp))
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(alert.title, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                Text(
                    alert.subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
                )
                Text(
                    alert.timeAgo,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.4f)
                )
            }

            if (!alert.acknowledged) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(CircleShape)
                        .background(iconTint)
                )
            }
        }
    }
}
