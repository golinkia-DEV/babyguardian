package cl.babyguardian.hub.ui.screens.pairing;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000D\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\t\b\u0007\u0018\u00002\u00020\u0001B\u001f\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u0012\u0006\u0010\u0006\u001a\u00020\u0007\u00a2\u0006\u0002\u0010\bJ\u0006\u0010\u0014\u001a\u00020\u0015J\u0006\u0010\u0016\u001a\u00020\u0015J\u0006\u0010\u0017\u001a\u00020\u0015J\u0010\u0010\u0018\u001a\u0004\u0018\u00010\rH\u0082@\u00a2\u0006\u0002\u0010\u0019J\b\u0010\u001a\u001a\u00020\u0015H\u0014J\u0006\u0010\u001b\u001a\u00020\u0015J\b\u0010\u001c\u001a\u00020\u0015H\u0002J\b\u0010\u001d\u001a\u00020\u0015H\u0002R\u0014\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u000b0\nX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0006\u001a\u00020\u0007X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0010\u0010\f\u001a\u0004\u0018\u00010\rX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0010\u0010\u000e\u001a\u0004\u0018\u00010\u000fX\u0082\u000e\u00a2\u0006\u0002\n\u0000R\u0017\u0010\u0010\u001a\b\u0012\u0004\u0012\u00020\u000b0\u0011\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0013\u00a8\u0006\u001e"}, d2 = {"Lcl/babyguardian/hub/ui/screens/pairing/PairingViewModel;", "Landroidx/lifecycle/ViewModel;", "devicesApi", "Lcl/babyguardian/hub/data/api/DevicesApi;", "homesApi", "Lcl/babyguardian/hub/data/api/HomesApi;", "hubPrefs", "Lcl/babyguardian/hub/data/local/HubPreferencesRepository;", "(Lcl/babyguardian/hub/data/api/DevicesApi;Lcl/babyguardian/hub/data/api/HomesApi;Lcl/babyguardian/hub/data/local/HubPreferencesRepository;)V", "_uiState", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcl/babyguardian/hub/ui/screens/pairing/PairingUiState;", "lastSessionHomeId", "", "pollingJob", "Lkotlinx/coroutines/Job;", "uiState", "Lkotlinx/coroutines/flow/StateFlow;", "getUiState", "()Lkotlinx/coroutines/flow/StateFlow;", "cancelSession", "", "clearError", "generatePairingCode", "getAuthToken", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "onCleared", "regenerateCode", "startCountdown", "startPolling", "app_debug"})
@dagger.hilt.android.lifecycle.HiltViewModel()
public final class PairingViewModel extends androidx.lifecycle.ViewModel {
    @org.jetbrains.annotations.NotNull()
    private final cl.babyguardian.hub.data.api.DevicesApi devicesApi = null;
    @org.jetbrains.annotations.NotNull()
    private final cl.babyguardian.hub.data.api.HomesApi homesApi = null;
    @org.jetbrains.annotations.NotNull()
    private final cl.babyguardian.hub.data.local.HubPreferencesRepository hubPrefs = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.MutableStateFlow<cl.babyguardian.hub.ui.screens.pairing.PairingUiState> _uiState = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.StateFlow<cl.babyguardian.hub.ui.screens.pairing.PairingUiState> uiState = null;
    @org.jetbrains.annotations.Nullable()
    private kotlinx.coroutines.Job pollingJob;
    
    /**
     * Hogar usado en la sesión actual; al pasar a claimed se persiste en preferencias.
     */
    @org.jetbrains.annotations.Nullable()
    private java.lang.String lastSessionHomeId;
    
    @javax.inject.Inject()
    public PairingViewModel(@org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.api.DevicesApi devicesApi, @org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.api.HomesApi homesApi, @org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.local.HubPreferencesRepository hubPrefs) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.StateFlow<cl.babyguardian.hub.ui.screens.pairing.PairingUiState> getUiState() {
        return null;
    }
    
    /**
     * Hub generates a new pairing session
     */
    public final void generatePairingCode() {
    }
    
    /**
     * Start countdown timer
     */
    private final void startCountdown() {
    }
    
    /**
     * Poll session status every 2-3 seconds
     */
    private final void startPolling() {
    }
    
    public final void regenerateCode() {
    }
    
    public final void cancelSession() {
    }
    
    public final void clearError() {
    }
    
    private final java.lang.Object getAuthToken(kotlin.coroutines.Continuation<? super java.lang.String> $completion) {
        return null;
    }
    
    @java.lang.Override()
    protected void onCleared() {
    }
}