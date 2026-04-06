package cl.babyguardian.hub.data.api;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000&\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010 \n\u0002\b\u0002\bf\u0018\u00002\u00020\u0001J\"\u0010\u0002\u001a\u00020\u00032\b\b\u0001\u0010\u0004\u001a\u00020\u00052\b\b\u0001\u0010\u0006\u001a\u00020\u0007H\u00a7@\u00a2\u0006\u0002\u0010\bJ\u001e\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u00030\n2\b\b\u0001\u0010\u0004\u001a\u00020\u0005H\u00a7@\u00a2\u0006\u0002\u0010\u000b\u00a8\u0006\f"}, d2 = {"Lcl/babyguardian/hub/data/api/HomesApi;", "", "createHome", "Lcl/babyguardian/hub/data/model/HomeDto;", "authorization", "", "request", "Lcl/babyguardian/hub/data/model/CreateHomeRequest;", "(Ljava/lang/String;Lcl/babyguardian/hub/data/model/CreateHomeRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getMyHomes", "", "(Ljava/lang/String;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public abstract interface HomesApi {
    
    @retrofit2.http.GET(value = "homes/mine")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getMyHomes(@retrofit2.http.Header(value = "Authorization")
    @org.jetbrains.annotations.NotNull()
    java.lang.String authorization, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<cl.babyguardian.hub.data.model.HomeDto>> $completion);
    
    @retrofit2.http.POST(value = "homes")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object createHome(@retrofit2.http.Header(value = "Authorization")
    @org.jetbrains.annotations.NotNull()
    java.lang.String authorization, @retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.model.CreateHomeRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super cl.babyguardian.hub.data.model.HomeDto> $completion);
}