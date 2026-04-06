package cl.babyguardian.hub.data.api;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00008\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0002\b\u0003\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\bf\u0018\u00002\u00020\u0001J$\u0010\u0002\u001a\u00020\u00032\n\b\u0001\u0010\u0004\u001a\u0004\u0018\u00010\u00052\b\b\u0001\u0010\u0006\u001a\u00020\u0005H\u00a7@\u00a2\u0006\u0002\u0010\u0007J$\u0010\b\u001a\u00020\t2\n\b\u0001\u0010\u0004\u001a\u0004\u0018\u00010\u00052\b\b\u0001\u0010\n\u001a\u00020\u000bH\u00a7@\u00a2\u0006\u0002\u0010\fJ$\u0010\r\u001a\u00020\u000e2\n\b\u0001\u0010\u0004\u001a\u0004\u0018\u00010\u00052\b\b\u0001\u0010\n\u001a\u00020\u000fH\u00a7@\u00a2\u0006\u0002\u0010\u0010J$\u0010\u0011\u001a\u00020\u00122\n\b\u0001\u0010\u0004\u001a\u0004\u0018\u00010\u00052\b\b\u0001\u0010\u0006\u001a\u00020\u0005H\u00a7@\u00a2\u0006\u0002\u0010\u0007\u00a8\u0006\u0013"}, d2 = {"Lcl/babyguardian/hub/data/api/DevicesApi;", "", "cancelPairingSession", "", "authorization", "", "sessionId", "(Ljava/lang/String;Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "confirmPairing", "Lcl/babyguardian/hub/data/model/PairingConfirmResponse;", "body", "Lcl/babyguardian/hub/data/model/PairingConfirmRequest;", "(Ljava/lang/String;Lcl/babyguardian/hub/data/model/PairingConfirmRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "createPairingSession", "Lcl/babyguardian/hub/data/model/PairingSessionResponse;", "Lcl/babyguardian/hub/data/model/CreatePairingSessionRequest;", "(Ljava/lang/String;Lcl/babyguardian/hub/data/model/CreatePairingSessionRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getPairingSessionStatus", "Lcl/babyguardian/hub/data/model/PairingSessionStatusResponse;", "app_debug"})
public abstract interface DevicesApi {
    
    @retrofit2.http.POST(value = "devices/pairing-confirm")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object confirmPairing(@retrofit2.http.Header(value = "Authorization")
    @org.jetbrains.annotations.Nullable()
    java.lang.String authorization, @retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.model.PairingConfirmRequest body, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super cl.babyguardian.hub.data.model.PairingConfirmResponse> $completion);
    
    @retrofit2.http.POST(value = "devices/pairing/sessions")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object createPairingSession(@retrofit2.http.Header(value = "Authorization")
    @org.jetbrains.annotations.Nullable()
    java.lang.String authorization, @retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.model.CreatePairingSessionRequest body, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super cl.babyguardian.hub.data.model.PairingSessionResponse> $completion);
    
    @retrofit2.http.GET(value = "devices/pairing/sessions/{sessionId}")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getPairingSessionStatus(@retrofit2.http.Header(value = "Authorization")
    @org.jetbrains.annotations.Nullable()
    java.lang.String authorization, @retrofit2.http.Path(value = "sessionId")
    @org.jetbrains.annotations.NotNull()
    java.lang.String sessionId, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super cl.babyguardian.hub.data.model.PairingSessionStatusResponse> $completion);
    
    @retrofit2.http.POST(value = "devices/pairing/sessions/{sessionId}/cancel")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object cancelPairingSession(@retrofit2.http.Header(value = "Authorization")
    @org.jetbrains.annotations.Nullable()
    java.lang.String authorization, @retrofit2.http.Path(value = "sessionId")
    @org.jetbrains.annotations.NotNull()
    java.lang.String sessionId, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion);
}