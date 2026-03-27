package cl.babyguardian.hub.ui.session;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u001e\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\b\u0007\u0018\u00002\u00020\u0001B\u000f\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004R\u0017\u0010\u0005\u001a\b\u0012\u0004\u0012\u00020\u00070\u0006\u00a2\u0006\b\n\u0000\u001a\u0004\b\b\u0010\t\u00a8\u0006\n"}, d2 = {"Lcl/babyguardian/hub/ui/session/SessionViewModel;", "Landroidx/lifecycle/ViewModel;", "hubPrefs", "Lcl/babyguardian/hub/data/local/HubPreferencesRepository;", "(Lcl/babyguardian/hub/data/local/HubPreferencesRepository;)V", "session", "Lkotlinx/coroutines/flow/StateFlow;", "Lcl/babyguardian/hub/ui/session/HubSession;", "getSession", "()Lkotlinx/coroutines/flow/StateFlow;", "app_debug"})
@dagger.hilt.android.lifecycle.HiltViewModel
public final class SessionViewModel extends androidx.lifecycle.ViewModel {
    @org.jetbrains.annotations.NotNull
    private final kotlinx.coroutines.flow.StateFlow<cl.babyguardian.hub.ui.session.HubSession> session = null;
    
    @javax.inject.Inject
    public SessionViewModel(@org.jetbrains.annotations.NotNull
    cl.babyguardian.hub.data.local.HubPreferencesRepository hubPrefs) {
        super();
    }
    
    @org.jetbrains.annotations.NotNull
    public final kotlinx.coroutines.flow.StateFlow<cl.babyguardian.hub.ui.session.HubSession> getSession() {
        return null;
    }
}