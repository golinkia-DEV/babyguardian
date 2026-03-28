package cl.babyguardian.hub.ui.session;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u001e\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0006\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\b6\u0018\u0000 \u00032\u00020\u0001:\u0005\u0003\u0004\u0005\u0006\u0007B\u0007\b\u0004\u00a2\u0006\u0002\u0010\u0002\u0082\u0001\u0004\b\t\n\u000b\u00a8\u0006\f"}, d2 = {"Lcl/babyguardian/hub/ui/session/HubSession;", "", "()V", "Companion", "Loading", "Login", "NeedsPairing", "Ready", "Lcl/babyguardian/hub/ui/session/HubSession$Loading;", "Lcl/babyguardian/hub/ui/session/HubSession$Login;", "Lcl/babyguardian/hub/ui/session/HubSession$NeedsPairing;", "Lcl/babyguardian/hub/ui/session/HubSession$Ready;", "app_debug"})
public abstract class HubSession {
    @org.jetbrains.annotations.NotNull()
    public static final cl.babyguardian.hub.ui.session.HubSession.Companion Companion = null;
    
    private HubSession() {
        super();
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u001e\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000b\n\u0000\b\u0086\u0003\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002J\u0016\u0010\u0003\u001a\u00020\u00042\u0006\u0010\u0005\u001a\u00020\u00062\u0006\u0010\u0007\u001a\u00020\b\u00a8\u0006\t"}, d2 = {"Lcl/babyguardian/hub/ui/session/HubSession$Companion;", "", "()V", "from", "Lcl/babyguardian/hub/ui/session/HubSession;", "snapshot", "Lcl/babyguardian/hub/data/model/HubSnapshot;", "devSkipAuth", "", "app_debug"})
    public static final class Companion {
        
        private Companion() {
            super();
        }
        
        /**
         * Si [devSkipAuth] (solo debug Hub), se considera sesión iniciada sin token; el backend debe usar AUTH_DEV_BYPASS.
         */
        @org.jetbrains.annotations.NotNull()
        public final cl.babyguardian.hub.ui.session.HubSession from(@org.jetbrains.annotations.NotNull()
        cl.babyguardian.hub.data.model.HubSnapshot snapshot, boolean devSkipAuth) {
            return null;
        }
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\f\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002\u00a8\u0006\u0003"}, d2 = {"Lcl/babyguardian/hub/ui/session/HubSession$Loading;", "Lcl/babyguardian/hub/ui/session/HubSession;", "()V", "app_debug"})
    public static final class Loading extends cl.babyguardian.hub.ui.session.HubSession {
        @org.jetbrains.annotations.NotNull()
        public static final cl.babyguardian.hub.ui.session.HubSession.Loading INSTANCE = null;
        
        private Loading() {
        }
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\f\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002\u00a8\u0006\u0003"}, d2 = {"Lcl/babyguardian/hub/ui/session/HubSession$Login;", "Lcl/babyguardian/hub/ui/session/HubSession;", "()V", "app_debug"})
    public static final class Login extends cl.babyguardian.hub.ui.session.HubSession {
        @org.jetbrains.annotations.NotNull()
        public static final cl.babyguardian.hub.ui.session.HubSession.Login INSTANCE = null;
        
        private Login() {
        }
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\f\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\b\u00c6\u0002\u0018\u00002\u00020\u0001B\u0007\b\u0002\u00a2\u0006\u0002\u0010\u0002\u00a8\u0006\u0003"}, d2 = {"Lcl/babyguardian/hub/ui/session/HubSession$NeedsPairing;", "Lcl/babyguardian/hub/ui/session/HubSession;", "()V", "app_debug"})
    public static final class NeedsPairing extends cl.babyguardian.hub.ui.session.HubSession {
        @org.jetbrains.annotations.NotNull()
        public static final cl.babyguardian.hub.ui.session.HubSession.NeedsPairing INSTANCE = null;
        
        private NeedsPairing() {
        }
    }
    
    @kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000&\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\t\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\b\n\u0002\b\u0002\b\u0086\b\u0018\u00002\u00020\u0001B\u0015\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0005J\t\u0010\t\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\n\u001a\u00020\u0003H\u00c6\u0003J\u001d\u0010\u000b\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u0003H\u00c6\u0001J\u0013\u0010\f\u001a\u00020\r2\b\u0010\u000e\u001a\u0004\u0018\u00010\u000fH\u00d6\u0003J\t\u0010\u0010\u001a\u00020\u0011H\u00d6\u0001J\t\u0010\u0012\u001a\u00020\u0003H\u00d6\u0001R\u0011\u0010\u0004\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0006\u0010\u0007R\u0011\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\b\n\u0000\u001a\u0004\b\b\u0010\u0007\u00a8\u0006\u0013"}, d2 = {"Lcl/babyguardian/hub/ui/session/HubSession$Ready;", "Lcl/babyguardian/hub/ui/session/HubSession;", "token", "", "homeId", "(Ljava/lang/String;Ljava/lang/String;)V", "getHomeId", "()Ljava/lang/String;", "getToken", "component1", "component2", "copy", "equals", "", "other", "", "hashCode", "", "toString", "app_debug"})
    public static final class Ready extends cl.babyguardian.hub.ui.session.HubSession {
        @org.jetbrains.annotations.NotNull()
        private final java.lang.String token = null;
        @org.jetbrains.annotations.NotNull()
        private final java.lang.String homeId = null;
        
        public Ready(@org.jetbrains.annotations.NotNull()
        java.lang.String token, @org.jetbrains.annotations.NotNull()
        java.lang.String homeId) {
        }
        
        @org.jetbrains.annotations.NotNull()
        public final java.lang.String getToken() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final java.lang.String getHomeId() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final java.lang.String component1() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final java.lang.String component2() {
            return null;
        }
        
        @org.jetbrains.annotations.NotNull()
        public final cl.babyguardian.hub.ui.session.HubSession.Ready copy(@org.jetbrains.annotations.NotNull()
        java.lang.String token, @org.jetbrains.annotations.NotNull()
        java.lang.String homeId) {
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
}