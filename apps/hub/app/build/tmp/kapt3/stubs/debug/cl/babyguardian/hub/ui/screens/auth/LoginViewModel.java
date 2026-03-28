package cl.babyguardian.hub.ui.screens.auth;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000:\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0006\b\u0007\u0018\u00002\u00020\u0001B\u0017\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u0006\u0010\u000e\u001a\u00020\u000fJ\u000e\u0010\u0010\u001a\u00020\u000f2\u0006\u0010\u0011\u001a\u00020\u0012J\u000e\u0010\u0013\u001a\u00020\u000f2\u0006\u0010\u0014\u001a\u00020\u0012J\u000e\u0010\u0015\u001a\u00020\u000f2\u0006\u0010\u0016\u001a\u00020\u0012J\u000e\u0010\u0017\u001a\u00020\u000f2\u0006\u0010\u0016\u001a\u00020\u0012R\u0014\u0010\u0007\u001a\b\u0012\u0004\u0012\u00020\t0\bX\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u0017\u0010\n\u001a\b\u0012\u0004\u0012\u00020\t0\u000b\u00a2\u0006\b\n\u0000\u001a\u0004\b\f\u0010\r\u00a8\u0006\u0018"}, d2 = {"Lcl/babyguardian/hub/ui/screens/auth/LoginViewModel;", "Landroidx/lifecycle/ViewModel;", "authApi", "Lcl/babyguardian/hub/data/api/AuthApi;", "hubPrefs", "Lcl/babyguardian/hub/data/local/HubPreferencesRepository;", "(Lcl/babyguardian/hub/data/api/AuthApi;Lcl/babyguardian/hub/data/local/HubPreferencesRepository;)V", "_uiState", "Lkotlinx/coroutines/flow/MutableStateFlow;", "Lcl/babyguardian/hub/ui/screens/auth/LoginUiState;", "uiState", "Lkotlinx/coroutines/flow/StateFlow;", "getUiState", "()Lkotlinx/coroutines/flow/StateFlow;", "login", "", "loginWithGoogle", "idToken", "", "reportGoogleSignInError", "message", "setEmail", "value", "setPassword", "app_debug"})
@dagger.hilt.android.lifecycle.HiltViewModel()
public final class LoginViewModel extends androidx.lifecycle.ViewModel {
    @org.jetbrains.annotations.NotNull()
    private final cl.babyguardian.hub.data.api.AuthApi authApi = null;
    @org.jetbrains.annotations.NotNull()
    private final cl.babyguardian.hub.data.local.HubPreferencesRepository hubPrefs = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.MutableStateFlow<cl.babyguardian.hub.ui.screens.auth.LoginUiState> _uiState = null;
    @org.jetbrains.annotations.NotNull()
    private final kotlinx.coroutines.flow.StateFlow<cl.babyguardian.hub.ui.screens.auth.LoginUiState> uiState = null;
    
    @javax.inject.Inject()
    public LoginViewModel(@org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.api.AuthApi authApi, @org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.local.HubPreferencesRepository hubPrefs) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull()
    public final kotlinx.coroutines.flow.StateFlow<cl.babyguardian.hub.ui.screens.auth.LoginUiState> getUiState() {
        return null;
    }
    
    public final void setEmail(@org.jetbrains.annotations.NotNull()
    java.lang.String value) {
    }
    
    public final void setPassword(@org.jetbrains.annotations.NotNull()
    java.lang.String value) {
    }
    
    public final void reportGoogleSignInError(@org.jetbrains.annotations.NotNull()
    java.lang.String message) {
    }
    
    public final void login() {
    }
    
    public final void loginWithGoogle(@org.jetbrains.annotations.NotNull()
    java.lang.String idToken) {
    }
}