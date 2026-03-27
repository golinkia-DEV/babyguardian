package cl.babyguardian.hub.ui.screens.dashboard;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0015\n\u0002\u0010\b\n\u0002\b\u0002\b\u0086\b\u0018\u00002\u00020\u0001BC\u0012\b\b\u0002\u0010\u0002\u001a\u00020\u0003\u0012\b\b\u0002\u0010\u0004\u001a\u00020\u0003\u0012\b\b\u0002\u0010\u0005\u001a\u00020\u0006\u0012\b\b\u0002\u0010\u0007\u001a\u00020\b\u0012\n\b\u0002\u0010\t\u001a\u0004\u0018\u00010\n\u0012\b\b\u0002\u0010\u000b\u001a\u00020\b\u00a2\u0006\u0002\u0010\fJ\t\u0010\u0016\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0017\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0018\u001a\u00020\u0006H\u00c6\u0003J\t\u0010\u0019\u001a\u00020\bH\u00c6\u0003J\u000b\u0010\u001a\u001a\u0004\u0018\u00010\nH\u00c6\u0003J\t\u0010\u001b\u001a\u00020\bH\u00c6\u0003JG\u0010\u001c\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00032\b\b\u0002\u0010\u0005\u001a\u00020\u00062\b\b\u0002\u0010\u0007\u001a\u00020\b2\n\b\u0002\u0010\t\u001a\u0004\u0018\u00010\n2\b\b\u0002\u0010\u000b\u001a\u00020\bH\u00c6\u0001J\u0013\u0010\u001d\u001a\u00020\b2\b\u0010\u001e\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010\u001f\u001a\u00020 H\u00d6\u0001J\t\u0010!\u001a\u00020\u0003H\u00d6\u0001R\u0011\u0010\u0004\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\r\u0010\u000eR\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000f\u0010\u000eR\u0011\u0010\u0005\u001a\u00020\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0010\u0010\u0011R\u0011\u0010\u0007\u001a\u00020\b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0013R\u0011\u0010\u000b\u001a\u00020\b\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\u0013R\u0013\u0010\t\u001a\u0004\u0018\u00010\n\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0014\u0010\u0015\u00a8\u0006\""}, d2 = {"Lcl/babyguardian/hub/ui/screens/dashboard/DashboardUiState;", "", "babyName", "", "babyAge", "babyState", "Lcl/babyguardian/hub/ui/screens/dashboard/BabyState;", "cameraConnected", "", "lastFeeding", "Lcl/babyguardian/hub/ui/screens/dashboard/LastFeedingInfo;", "isLoading", "(Ljava/lang/String;Ljava/lang/String;Lcl/babyguardian/hub/ui/screens/dashboard/BabyState;ZLcl/babyguardian/hub/ui/screens/dashboard/LastFeedingInfo;Z)V", "getBabyAge", "()Ljava/lang/String;", "getBabyName", "getBabyState", "()Lcl/babyguardian/hub/ui/screens/dashboard/BabyState;", "getCameraConnected", "()Z", "getLastFeeding", "()Lcl/babyguardian/hub/ui/screens/dashboard/LastFeedingInfo;", "component1", "component2", "component3", "component4", "component5", "component6", "copy", "equals", "other", "hashCode", "", "toString", "app_debug"})
public final class DashboardUiState {
    @org.jetbrains.annotations.NotNull
    private final java.lang.String babyName = null;
    @org.jetbrains.annotations.NotNull
    private final java.lang.String babyAge = null;
    @org.jetbrains.annotations.NotNull
    private final cl.babyguardian.hub.ui.screens.dashboard.BabyState babyState = null;
    private final boolean cameraConnected = false;
    @org.jetbrains.annotations.Nullable
    private final cl.babyguardian.hub.ui.screens.dashboard.LastFeedingInfo lastFeeding = null;
    private final boolean isLoading = false;
    
    public DashboardUiState(@org.jetbrains.annotations.NotNull
    java.lang.String babyName, @org.jetbrains.annotations.NotNull
    java.lang.String babyAge, @org.jetbrains.annotations.NotNull
    cl.babyguardian.hub.ui.screens.dashboard.BabyState babyState, boolean cameraConnected, @org.jetbrains.annotations.Nullable
    cl.babyguardian.hub.ui.screens.dashboard.LastFeedingInfo lastFeeding, boolean isLoading) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.lang.String getBabyName() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.lang.String getBabyAge() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final cl.babyguardian.hub.ui.screens.dashboard.BabyState getBabyState() {
        return null;
    }
    
    public final boolean getCameraConnected() {
        return false;
    }
    
    @org.jetbrains.annotations.Nullable
    public final cl.babyguardian.hub.ui.screens.dashboard.LastFeedingInfo getLastFeeding() {
        return null;
    }
    
    public final boolean isLoading() {
        return false;
    }
    
    public DashboardUiState() {
        super();
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.lang.String component1() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final java.lang.String component2() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull
    public final cl.babyguardian.hub.ui.screens.dashboard.BabyState component3() {
        return null;
    }
    
    public final boolean component4() {
        return false;
    }
    
    @org.jetbrains.annotations.Nullable
    public final cl.babyguardian.hub.ui.screens.dashboard.LastFeedingInfo component5() {
        return null;
    }
    
    public final boolean component6() {
        return false;
    }
    
    @org.jetbrains.annotations.NotNull
    public final cl.babyguardian.hub.ui.screens.dashboard.DashboardUiState copy(@org.jetbrains.annotations.NotNull
    java.lang.String babyName, @org.jetbrains.annotations.NotNull
    java.lang.String babyAge, @org.jetbrains.annotations.NotNull
    cl.babyguardian.hub.ui.screens.dashboard.BabyState babyState, boolean cameraConnected, @org.jetbrains.annotations.Nullable
    cl.babyguardian.hub.ui.screens.dashboard.LastFeedingInfo lastFeeding, boolean isLoading) {
        return null;
    }
    
    @java.lang.Override
    public boolean equals(@org.jetbrains.annotations.Nullable
    java.lang.Object other) {
        return false;
    }
    
    @java.lang.Override
    public int hashCode() {
        return 0;
    }
    
    @java.lang.Override
    @org.jetbrains.annotations.NotNull
    public java.lang.String toString() {
        return null;
    }
}