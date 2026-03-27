package cl.babyguardian.hub.service;

import android.content.Context;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata("dagger.hilt.android.qualifiers.ApplicationContext")
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava"
})
public final class FaceRecognitionManager_Factory implements Factory<FaceRecognitionManager> {
  private final Provider<Context> contextProvider;

  public FaceRecognitionManager_Factory(Provider<Context> contextProvider) {
    this.contextProvider = contextProvider;
  }

  @Override
  public FaceRecognitionManager get() {
    return newInstance(contextProvider.get());
  }

  public static FaceRecognitionManager_Factory create(Provider<Context> contextProvider) {
    return new FaceRecognitionManager_Factory(contextProvider);
  }

  public static FaceRecognitionManager newInstance(Context context) {
    return new FaceRecognitionManager(context);
  }
}
