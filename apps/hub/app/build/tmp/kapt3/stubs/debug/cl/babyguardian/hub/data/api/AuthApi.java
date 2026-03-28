package cl.babyguardian.hub.data.api;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000 \n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\bf\u0018\u00002\u00020\u0001J\u0018\u0010\u0002\u001a\u00020\u00032\b\b\u0001\u0010\u0004\u001a\u00020\u0005H\u00a7@\u00a2\u0006\u0002\u0010\u0006J\u0018\u0010\u0007\u001a\u00020\u00032\b\b\u0001\u0010\u0004\u001a\u00020\bH\u00a7@\u00a2\u0006\u0002\u0010\t\u00a8\u0006\n"}, d2 = {"Lcl/babyguardian/hub/data/api/AuthApi;", "", "googleLogin", "Lcl/babyguardian/hub/data/model/LoginResponse;", "body", "Lcl/babyguardian/hub/data/model/GoogleLoginRequest;", "(Lcl/babyguardian/hub/data/model/GoogleLoginRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "login", "Lcl/babyguardian/hub/data/model/LoginRequest;", "(Lcl/babyguardian/hub/data/model/LoginRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public abstract interface AuthApi {
    
    @retrofit2.http.POST(value = "auth/login")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object login(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.model.LoginRequest body, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super cl.babyguardian.hub.data.model.LoginResponse> $completion);
    
    @retrofit2.http.POST(value = "auth/google")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object googleLogin(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.model.GoogleLoginRequest body, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super cl.babyguardian.hub.data.model.LoginResponse> $completion);
}