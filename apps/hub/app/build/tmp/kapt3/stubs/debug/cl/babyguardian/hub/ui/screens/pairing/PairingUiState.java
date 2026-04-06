package cl.babyguardian.hub.ui.screens.pairing;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\"\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0004\n\u0002\u0010\u000b\n\u0002\b\u0004\n\u0002\u0010\b\n\u0002\b\u0019\b\u0086\b\u0018\u00002\u00020\u0001Bi\u0012\n\b\u0002\u0010\u0002\u001a\u0004\u0018\u00010\u0003\u0012\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u0003\u0012\n\b\u0002\u0010\u0005\u001a\u0004\u0018\u00010\u0003\u0012\n\b\u0002\u0010\u0006\u001a\u0004\u0018\u00010\u0003\u0012\b\b\u0002\u0010\u0007\u001a\u00020\b\u0012\b\b\u0002\u0010\t\u001a\u00020\b\u0012\n\b\u0002\u0010\n\u001a\u0004\u0018\u00010\u0003\u0012\b\b\u0002\u0010\u000b\u001a\u00020\b\u0012\b\b\u0002\u0010\f\u001a\u00020\r\u00a2\u0006\u0002\u0010\u000eJ\u000b\u0010\u0018\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u000b\u0010\u0019\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u000b\u0010\u001a\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\u000b\u0010\u001b\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\t\u0010\u001c\u001a\u00020\bH\u00c6\u0003J\t\u0010\u001d\u001a\u00020\bH\u00c6\u0003J\u000b\u0010\u001e\u001a\u0004\u0018\u00010\u0003H\u00c6\u0003J\t\u0010\u001f\u001a\u00020\bH\u00c6\u0003J\t\u0010 \u001a\u00020\rH\u00c6\u0003Jm\u0010!\u001a\u00020\u00002\n\b\u0002\u0010\u0002\u001a\u0004\u0018\u00010\u00032\n\b\u0002\u0010\u0004\u001a\u0004\u0018\u00010\u00032\n\b\u0002\u0010\u0005\u001a\u0004\u0018\u00010\u00032\n\b\u0002\u0010\u0006\u001a\u0004\u0018\u00010\u00032\b\b\u0002\u0010\u0007\u001a\u00020\b2\b\b\u0002\u0010\t\u001a\u00020\b2\n\b\u0002\u0010\n\u001a\u0004\u0018\u00010\u00032\b\b\u0002\u0010\u000b\u001a\u00020\b2\b\b\u0002\u0010\f\u001a\u00020\rH\u00c6\u0001J\u0013\u0010\"\u001a\u00020\b2\b\u0010#\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010$\u001a\u00020\rH\u00d6\u0001J\t\u0010%\u001a\u00020\u0003H\u00d6\u0001R\u0013\u0010\n\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000f\u0010\u0010R\u0013\u0010\u0006\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0011\u0010\u0010R\u0011\u0010\u0007\u001a\u00020\b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0007\u0010\u0012R\u0011\u0010\u000b\u001a\u00020\b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\u0012R\u0011\u0010\t\u001a\u00020\b\u00a2\u0006\b\n\u0000\u001a\u0004\b\t\u0010\u0012R\u0013\u0010\u0002\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0013\u0010\u0010R\u0013\u0010\u0004\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0014\u0010\u0010R\u0011\u0010\f\u001a\u00020\r\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0015\u0010\u0016R\u0013\u0010\u0005\u001a\u0004\u0018\u00010\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0017\u0010\u0010\u00a8\u0006&"}, d2 = {"Lcl/babyguardian/hub/ui/screens/pairing/PairingUiState;", "", "pairingCode", "", "qrData", "sessionId", "expiresAt", "isLoading", "", "isPolling", "error", "isPaired", "secondsRemaining", "", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZZLjava/lang/String;ZI)V", "getError", "()Ljava/lang/String;", "getExpiresAt", "()Z", "getPairingCode", "getQrData", "getSecondsRemaining", "()I", "getSessionId", "component1", "component2", "component3", "component4", "component5", "component6", "component7", "component8", "component9", "copy", "equals", "other", "hashCode", "toString", "app_debug"})
public final class PairingUiState {
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String pairingCode = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String qrData = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String sessionId = null;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String expiresAt = null;
    private final boolean isLoading = false;
    private final boolean isPolling = false;
    @org.jetbrains.annotations.Nullable()
    private final java.lang.String error = null;
    private final boolean isPaired = false;
    private final int secondsRemaining = 0;
    
    public PairingUiState(@org.jetbrains.annotations.Nullable()
    java.lang.String pairingCode, @org.jetbrains.annotations.Nullable()
    java.lang.String qrData, @org.jetbrains.annotations.Nullable()
    java.lang.String sessionId, @org.jetbrains.annotations.Nullable()
    java.lang.String expiresAt, boolean isLoading, boolean isPolling, @org.jetbrains.annotations.Nullable()
    java.lang.String error, boolean isPaired, int secondsRemaining) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getPairingCode() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getQrData() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getSessionId() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getExpiresAt() {
        return null;
    }
    
    public final boolean isLoading() {
        return false;
    }
    
    public final boolean isPolling() {
        return false;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String getError() {
        return null;
    }
    
    public final boolean isPaired() {
        return false;
    }
    
    public final int getSecondsRemaining() {
        return 0;
    }
    
    public PairingUiState() {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component1() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component2() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component3() {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component4() {
        return null;
    }
    
    public final boolean component5() {
        return false;
    }
    
    public final boolean component6() {
        return false;
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String component7() {
        return null;
    }
    
    public final boolean component8() {
        return false;
    }
    
    public final int component9() {
        return 0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final cl.babyguardian.hub.ui.screens.pairing.PairingUiState copy(@org.jetbrains.annotations.Nullable()
    java.lang.String pairingCode, @org.jetbrains.annotations.Nullable()
    java.lang.String qrData, @org.jetbrains.annotations.Nullable()
    java.lang.String sessionId, @org.jetbrains.annotations.Nullable()
    java.lang.String expiresAt, boolean isLoading, boolean isPolling, @org.jetbrains.annotations.Nullable()
    java.lang.String error, boolean isPaired, int secondsRemaining) {
        return null;
    }
    
    @java.lang.Override()
    public boolean equals(@org.jetbrains.annotations.Nullable()
    java.lang.Object other) {
        return false;
    }
    
    @java.lang.Override()
    public int hashCode() {
        return 0;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public java.lang.String toString() {
        return null;
    }
}