package cl.babyguardian.hub.data.api;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000\u001e\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\bf\u0018\u00002\u00020\u0001J%\u0010\u0002\u001a\u00020\u00032\b\b\u0001\u0010\u0004\u001a\u00020\u00052\b\b\u0001\u0010\u0006\u001a\u00020\u0007H\u00a7@\u00f8\u0001\u0000\u00a2\u0006\u0002\u0010\b\u0082\u0002\u0004\n\u0002\b\u0019\u00a8\u0006\t"}, d2 = {"Lcl/babyguardian/hub/data/api/DevicesApi;", "", "confirmPairing", "Lcl/babyguardian/hub/data/model/PairingConfirmResponse;", "authorization", "", "body", "Lcl/babyguardian/hub/data/model/PairingConfirmRequest;", "(Ljava/lang/String;Lcl/babyguardian/hub/data/model/PairingConfirmRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public abstract interface DevicesApi {
    
    @retrofit2.http.POST(value = "devices/pairing-confirm")
    @org.jetbrains.annotations.Nullable
    public abstract java.lang.Object confirmPairing(@retrofit2.http.Header(value = "Authorization")
    @org.jetbrains.annotations.NotNull
    java.lang.String authorization, @retrofit2.http.Body
    @org.jetbrains.annotations.NotNull
    cl.babyguardian.hub.data.model.PairingConfirmRequest body, @org.jetbrains.annotations.NotNull
    kotlin.coroutines.Continuation<? super cl.babyguardian.hub.data.model.PairingConfirmResponse> $completion);
}