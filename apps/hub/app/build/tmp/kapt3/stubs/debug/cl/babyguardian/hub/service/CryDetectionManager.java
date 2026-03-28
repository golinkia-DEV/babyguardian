package cl.babyguardian.hub.service;

/**
 * Manages on-device cry detection using TensorFlow Lite audio model.
 * Processes microphone input in real-time and reports confidence scores.
 */
@javax.inject.Singleton()
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00000\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\u0010\u0007\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\b\u0007\u0018\u00002\u00020\u0001B\u000f\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004JA\u0010\u0005\u001a\u00020\u000621\u0010\u0007\u001a-\b\u0001\u0012\u0013\u0012\u00110\t\u00a2\u0006\f\b\n\u0012\b\b\u000b\u0012\u0004\b\b(\f\u0012\n\u0012\b\u0012\u0004\u0012\u00020\u00060\r\u0012\u0006\u0012\u0004\u0018\u00010\u00010\bH\u0086@\u00a2\u0006\u0002\u0010\u000eJ\u0006\u0010\u000f\u001a\u00020\u0006R\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0010"}, d2 = {"Lcl/babyguardian/hub/service/CryDetectionManager;", "", "modelDownloadManager", "Lcl/babyguardian/hub/service/ModelDownloadManager;", "(Lcl/babyguardian/hub/service/ModelDownloadManager;)V", "startListening", "", "onCryDetected", "Lkotlin/Function2;", "", "Lkotlin/ParameterName;", "name", "confidence", "Lkotlin/coroutines/Continuation;", "(Lkotlin/jvm/functions/Function2;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "stop", "app_debug"})
public final class CryDetectionManager {
    @org.jetbrains.annotations.NotNull()
    private final cl.babyguardian.hub.service.ModelDownloadManager modelDownloadManager = null;
    
    @javax.inject.Inject()
    public CryDetectionManager(@org.jetbrains.annotations.NotNull()
    cl.babyguardian.hub.service.ModelDownloadManager modelDownloadManager) {
        super();
    }
    
    @kotlin.Suppress(names = {"UNUSED_PARAMETER"})
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object startListening(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function2<? super java.lang.Float, ? super kotlin.coroutines.Continuation<? super kotlin.Unit>, ? extends java.lang.Object> onCryDetected, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
    
    public final void stop() {
    }
}