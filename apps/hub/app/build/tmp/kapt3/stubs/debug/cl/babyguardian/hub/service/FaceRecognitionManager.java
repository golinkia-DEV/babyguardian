package cl.babyguardian.hub.service;

/**
 * Manages face detection and recognition using ML Kit + MobileFaceNet embeddings.
 * Stores face embeddings in ObjectBox vector database for fast similarity search.
 */
@javax.inject.Singleton()
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000P\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000b\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\u000e\n\u0000\n\u0002\u0010\u0014\n\u0002\b\u0002\n\u0002\u0010\u0007\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\b\u0007\u0018\u00002\u00020\u0001B\u0011\b\u0007\u0012\b\b\u0001\u0010\u0002\u001a\u00020\u0003\u00a2\u0006\u0002\u0010\u0004J\u0016\u0010\u0007\u001a\u00020\b2\u0006\u0010\t\u001a\u00020\n2\u0006\u0010\u000b\u001a\u00020\fJ\u001a\u0010\r\u001a\u0004\u0018\u00010\n2\u0006\u0010\u000b\u001a\u00020\f2\b\b\u0002\u0010\u000e\u001a\u00020\u000fJG\u0010\u0010\u001a\u00020\b27\u0010\u0011\u001a3\b\u0001\u0012\u0019\u0012\u0017\u0012\u0004\u0012\u00020\u00140\u0013\u00a2\u0006\f\b\u0015\u0012\b\b\u0016\u0012\u0004\b\b(\u0017\u0012\n\u0012\b\u0012\u0004\u0012\u00020\b0\u0018\u0012\u0006\u0012\u0004\u0018\u00010\u00010\u0012H\u0086@\u00a2\u0006\u0002\u0010\u0019J\u0006\u0010\u001a\u001a\u00020\bR\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0005\u001a\u00020\u0006X\u0082\u000e\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u001b"}, d2 = {"Lcl/babyguardian/hub/service/FaceRecognitionManager;", "", "context", "Landroid/content/Context;", "(Landroid/content/Context;)V", "isDetecting", "", "addFaceEmbedding", "", "faceGroupId", "", "embedding", "", "findSimilarFace", "threshold", "", "startDetecting", "onFacesDetected", "Lkotlin/Function2;", "", "Lcl/babyguardian/hub/service/DetectedFace;", "Lkotlin/ParameterName;", "name", "faces", "Lkotlin/coroutines/Continuation;", "(Lkotlin/jvm/functions/Function2;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "stop", "app_debug"})
public final class FaceRecognitionManager {
    @org.jetbrains.annotations.NotNull()
    private final android.content.Context context = null;
    private boolean isDetecting = false;
    
    @javax.inject.Inject()
    public FaceRecognitionManager(@dagger.hilt.android.qualifiers.ApplicationContext()
    @org.jetbrains.annotations.NotNull()
    android.content.Context context) {
        super();
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.Object startDetecting(@org.jetbrains.annotations.NotNull()
    kotlin.jvm.functions.Function2<? super java.util.List<cl.babyguardian.hub.service.DetectedFace>, ? super kotlin.coroutines.Continuation<? super kotlin.Unit>, ? extends java.lang.Object> onFacesDetected, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
    
    public final void stop() {
    }
    
    public final void addFaceEmbedding(@org.jetbrains.annotations.NotNull()
    java.lang.String faceGroupId, @org.jetbrains.annotations.NotNull()
    float[] embedding) {
    }
    
    @org.jetbrains.annotations.Nullable()
    public final java.lang.String findSimilarFace(@org.jetbrains.annotations.NotNull()
    float[] embedding, float threshold) {
        return null;
    }
}