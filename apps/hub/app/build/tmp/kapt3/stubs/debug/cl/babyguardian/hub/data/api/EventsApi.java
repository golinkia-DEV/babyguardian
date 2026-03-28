package cl.babyguardian.hub.data.api;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000&\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010$\n\u0002\u0010\u000e\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\bf\u0018\u00002\u00020\u0001J=\u0010\u0002\u001a\u001b\u0012\u0017\u0012\u0015\u0012\u0004\u0012\u00020\u0005\u0012\u000b\u0012\t\u0018\u00010\u0001\u00a2\u0006\u0002\b\u00060\u00040\u00032\n\b\u0001\u0010\u0007\u001a\u0004\u0018\u00010\u00052\b\b\u0001\u0010\b\u001a\u00020\tH\u00a7@\u00a2\u0006\u0002\u0010\n\u00a8\u0006\u000b"}, d2 = {"Lcl/babyguardian/hub/data/api/EventsApi;", "", "createEvent", "Lretrofit2/Response;", "", "", "Lkotlin/jvm/JvmSuppressWildcards;", "authorization", "body", "Lcl/babyguardian/hub/data/model/CreateEventRequest;", "(Ljava/lang/String;Lcl/babyguardian/hub/data/model/CreateEventRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public abstract interface EventsApi {
    
    @retrofit2.http.POST(value = "events")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object createEvent(@retrofit2.http.Header(value = "Authorization")
    @org.jetbrains.annotations.Nullable()
    java.lang.String authorization, @retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.data.model.CreateEventRequest body, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super retrofit2.Response<java.util.Map<java.lang.String, java.lang.Object>>> $completion);
}