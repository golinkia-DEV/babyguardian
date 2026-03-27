package cl.babyguardian.hub.service;

import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata
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
public final class CryDetectionManager_Factory implements Factory<CryDetectionManager> {
  private final Provider<ModelDownloadManager> modelDownloadManagerProvider;

  public CryDetectionManager_Factory(Provider<ModelDownloadManager> modelDownloadManagerProvider) {
    this.modelDownloadManagerProvider = modelDownloadManagerProvider;
  }

  @Override
  public CryDetectionManager get() {
    return newInstance(modelDownloadManagerProvider.get());
  }

  public static CryDetectionManager_Factory create(
      Provider<ModelDownloadManager> modelDownloadManagerProvider) {
    return new CryDetectionManager_Factory(modelDownloadManagerProvider);
  }

  public static CryDetectionManager newInstance(ModelDownloadManager modelDownloadManager) {
    return new CryDetectionManager(modelDownloadManager);
  }
}
