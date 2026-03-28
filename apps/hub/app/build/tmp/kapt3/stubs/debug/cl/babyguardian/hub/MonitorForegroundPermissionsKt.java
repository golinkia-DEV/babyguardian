package cl.babyguardian.hub;

@kotlin.Metadata(mv = {1, 9, 0}, k = 2, xi = 48, d1 = {"\u0000\f\n\u0000\n\u0002\u0010\u000b\n\u0002\u0018\u0002\n\u0000\u001a\n\u0010\u0000\u001a\u00020\u0001*\u00020\u0002\u00a8\u0006\u0003"}, d2 = {"hasMonitorForegroundPermissions", "", "Landroid/content/Context;", "app_debug"})
public final class MonitorForegroundPermissionsKt {
    
    /**
     * Permisos de tiempo de ejecución exigidos por Android 14+ para FGS tipo micrófono y cámara.
     */
    public static final boolean hasMonitorForegroundPermissions(@org.jetbrains.annotations.NotNull()
    android.content.Context $this$hasMonitorForegroundPermissions) {
        return false;
    }
}