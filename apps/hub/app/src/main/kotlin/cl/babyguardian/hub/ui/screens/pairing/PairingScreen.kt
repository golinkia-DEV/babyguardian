package cl.babyguardian.hub.ui.screens.pairing

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Link
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import cl.babyguardian.hub.ui.theme.Turquoise
import com.google.zxing.BarcodeFormat
import com.google.zxing.MultiFormatWriter
import com.google.zxing.common.BitMatrix
import androidx.compose.ui.graphics.asImageBitmap

@Composable
fun PairingScreen(
    viewModel: PairingViewModel = hiltViewModel(),
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        if (uiState.pairingCode == null) {
            viewModel.generatePairingCode()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(40.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Column(
            modifier = Modifier.widthIn(max = 600.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            // Header
            Icon(
                Icons.Default.Link,
                contentDescription = null,
                tint = Turquoise,
                modifier = Modifier.size(64.dp),
            )
            Spacer(Modifier.height(20.dp))
            Text(
                "Vincular BabyGuardian Hub",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
            )
            Spacer(Modifier.height(8.dp))
            Text(
                "Genera un código en el hub para que el móvil se conecte.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.65f),
                textAlign = TextAlign.Center,
            )
            Spacer(Modifier.height(32.dp))

            if (uiState.isPaired) {
                // Success state
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 40.dp),
                ) {
                    Icon(
                        Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = Turquoise,
                        modifier = Modifier.size(80.dp),
                    )
                    Spacer(Modifier.height(20.dp))
                    Text(
                        "¡Vinculado correctamente!",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "El móvil se ha conectado al hub exitosamente.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.65f),
                        textAlign = TextAlign.Center,
                    )
                }
            } else if (uiState.pairingCode != null) {
                // Display code and QR
                Text(
                    "Código de emparejado",
                    style = MaterialTheme.typography.labelMedium,
                    modifier = Modifier.align(Alignment.Start),
                )
                Spacer(Modifier.height(12.dp))

                // Large code display
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            2.dp,
                            Turquoise,
                            shape = MaterialTheme.shapes.medium,
                        )
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(
                        uiState.pairingCode ?: "",
                        style = MaterialTheme.typography.displaySmall.copy(
                            fontFamily = FontFamily.Monospace,
                            letterSpacing = 6.sp,
                        ),
                        color = Turquoise,
                        fontWeight = FontWeight.Bold,
                    )
                    Spacer(Modifier.height(16.dp))
                    Text(
                        "Tiempo restante: ${formatTime(uiState.secondsRemaining)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.65f),
                    )
                }
                Spacer(Modifier.height(24.dp))

                // QR Code
                uiState.qrData?.let { qrData ->
                    Text(
                        "O escanea este código QR",
                        style = MaterialTheme.typography.labelMedium,
                        modifier = Modifier.align(Alignment.Start),
                    )
                    Spacer(Modifier.height(12.dp))
                    Column(
                        modifier = Modifier
                            .size(280.dp)
                            .background(Color.White, shape = MaterialTheme.shapes.medium)
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                    ) {
                        val qrBitmap = generateQrCode(qrData)
                        if (qrBitmap != null) {
                            androidx.compose.foundation.Image(
                                bitmap = qrBitmap.asImageBitmap(),
                                contentDescription = "QR Code",
                                modifier = Modifier.size(240.dp),
                            )
                        } else {
                            CircularProgressIndicator()
                        }
                    }
                    Spacer(Modifier.height(24.dp))
                }

                // Error message
                uiState.error?.let { error ->
                    Spacer(Modifier.height(12.dp))
                    Text(
                        error,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall,
                        textAlign = TextAlign.Center,
                    )
                    Spacer(Modifier.height(12.dp))
                }

                // Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    OutlinedButton(
                        onClick = viewModel::regenerateCode,
                        modifier = Modifier.weight(1f),
                        enabled = !uiState.isLoading,
                    ) {
                        Icon(
                            Icons.Default.Refresh,
                            contentDescription = null,
                            modifier = Modifier
                                .size(18.dp)
                                .padding(end = 8.dp),
                        )
                        Text("Regenerar")
                    }
                    Button(
                        onClick = viewModel::cancelSession,
                        modifier = Modifier.weight(1f),
                        enabled = !uiState.isLoading,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.errorContainer,
                            contentColor = MaterialTheme.colorScheme.onErrorContainer,
                        ),
                    ) {
                        Text("Cancelar")
                    }
                }
            } else {
                // pairingCode == null: carga inicial, petición en curso o fallo (antes de mostrar QR)
                val waitingInitial =
                    uiState.error == null && !uiState.isLoading && uiState.pairingCode == null
                if (uiState.isLoading || waitingInitial) {
                    CircularProgressIndicator()
                    Spacer(Modifier.height(16.dp))
                }
                Text(
                    when {
                        uiState.error != null -> "No se pudo generar el código"
                        else -> "Generando código..."
                    },
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.85f),
                    textAlign = TextAlign.Center,
                )
                uiState.error?.let { err ->
                    Spacer(Modifier.height(16.dp))
                    Text(
                        err,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall,
                        textAlign = TextAlign.Center,
                    )
                }
                if (uiState.error != null) {
                    Spacer(Modifier.height(20.dp))
                    Button(onClick = { viewModel.generatePairingCode() }) {
                        Text("Reintentar")
                    }
                }
            }
        }
    }
}

private fun generateQrCode(data: String): android.graphics.Bitmap? {
    return try {
        val writer = MultiFormatWriter()
        val bitMatrix: BitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, 800, 800)
        val width = bitMatrix.width
        val height = bitMatrix.height
        val bitmap = android.graphics.Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.RGB_565)
        for (x in 0 until width) {
            for (y in 0 until height) {
                bitmap.setPixel(x, y, if (bitMatrix[x, y]) android.graphics.Color.BLACK else android.graphics.Color.WHITE)
            }
        }
        bitmap
    } catch (e: Exception) {
        null
    }
}

private fun formatTime(seconds: Int): String {
    val minutes = seconds / 60
    val secs = seconds % 60
    return String.format("%02d:%02d", minutes, secs)
}
