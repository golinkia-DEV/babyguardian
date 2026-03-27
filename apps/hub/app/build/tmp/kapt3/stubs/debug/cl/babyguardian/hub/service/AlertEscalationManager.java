package cl.babyguardian.hub.service;

/**
 * Handles alert escalation logic:
 * - Debouncing (avoid alert spam)
 * - Severity classification
 * - Reporting events to the backend (FCM to parents is triggered server-side)
 */
@javax.inject.Singleton
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000:\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\t\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u0007\n\u0002\b\u0003\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0002\b\u0002\b\u0007\u0018\u00002\u00020\u0001B\u0017\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u0019\u0010\n\u001a\u00020\u000b2\u0006\u0010\f\u001a\u00020\rH\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u000eJ\u001f\u0010\u000f\u001a\u00020\u000b2\f\u0010\u0010\u001a\b\u0012\u0004\u0012\u00020\u00120\u0011H\u0086@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\u0013R\u000e\u0010\u0007\u001a\u00020\bX\u0082D\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\t\u001a\u00020\bX\u0082\u000e\u00a2\u0006\u0002\n\u0000\u0082\u0002\u0004\n\u0002\b\u0019\u00a8\u0006\u0014"}, d2 = {"Lcl/babyguardian/hub/service/AlertEscalationManager;", "", "hubPrefs", "Lcl/babyguardian/hub/data/local/HubPreferencesRepository;", "eventsApi", "Lcl/babyguardian/hub/data/api/EventsApi;", "(Lcl/babyguardian/hub/data/local/HubPreferencesRepository;Lcl/babyguardian/hub/data/api/EventsApi;)V", "cryDebounceMs", "", "lastCryAlertTime", "onCryDetected", "", "confidence", "", "(FLkotlin/coroutines/Continuation;)Ljava/lang/Object;", "onFacesDetected", "faces", "", "Lcl/babyguardian/hub/service/DetectedFace;", "(Ljava/util/List;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public final class AlertEscalationManager {
    @org.jetbrains.annotations.NotNull
    private final cl.babyguardian.hub.data.local.HubPreferencesRepository hubPrefs = null;
    @org.jetbrains.annotations.NotNull
    private final cl.babyguardian.hub.data.api.EventsApi eventsApi = null;
    private long lastCryAlertTime = 0L;
    private final long cryDebounceMs = 30000L;
    
    @javax.inject.Inject
    public AlertEscalationManager(@org.jetbrains.annotations.NotNull
    cl.babyguardian.hub.data.local.HubPreferencesRepository hubPrefs, @org.jetbrains.annotations.NotNull
    cl.babyguardian.hub.data.api.EventsApi eventsApi) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object onCryDetected(float confidence, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
    
    @org.jetbrains.annotations.Nullable
    public final java.lang.Object onFacesDetected(@org.jetbrains.annotations.NotNull
    java.util.List<cl.babyguardian.hub.service.DetectedFace> faces, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
}