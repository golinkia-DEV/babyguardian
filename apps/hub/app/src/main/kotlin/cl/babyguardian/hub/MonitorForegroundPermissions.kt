package cl.babyguardian.hub

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat

/** Permisos de tiempo de ejecución exigidos por Android 14+ para FGS tipo micrófono y cámara. */
fun Context.hasMonitorForegroundPermissions(): Boolean =
    arrayOf(Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA).all { perm ->
        ContextCompat.checkSelfPermission(this, perm) == PackageManager.PERMISSION_GRANTED
    }
