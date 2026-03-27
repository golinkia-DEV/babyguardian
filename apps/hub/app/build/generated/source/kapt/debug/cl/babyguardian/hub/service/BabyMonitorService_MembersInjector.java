package cl.babyguardian.hub.service;

import dagger.MembersInjector;
import dagger.internal.DaggerGenerated;
import dagger.internal.InjectedFieldSignature;
import dagger.internal.QualifierMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

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
public final class BabyMonitorService_MembersInjector implements MembersInjector<BabyMonitorService> {
  private final Provider<CryDetectionManager> cryDetectorProvider;

  private final Provider<FaceRecognitionManager> faceRecognizerProvider;

  private final Provider<AlertEscalationManager> alertManagerProvider;

  public BabyMonitorService_MembersInjector(Provider<CryDetectionManager> cryDetectorProvider,
      Provider<FaceRecognitionManager> faceRecognizerProvider,
      Provider<AlertEscalationManager> alertManagerProvider) {
    this.cryDetectorProvider = cryDetectorProvider;
    this.faceRecognizerProvider = faceRecognizerProvider;
    this.alertManagerProvider = alertManagerProvider;
  }

  public static MembersInjector<BabyMonitorService> create(
      Provider<CryDetectionManager> cryDetectorProvider,
      Provider<FaceRecognitionManager> faceRecognizerProvider,
      Provider<AlertEscalationManager> alertManagerProvider) {
    return new BabyMonitorService_MembersInjector(cryDetectorProvider, faceRecognizerProvider, alertManagerProvider);
  }

  @Override
  public void injectMembers(BabyMonitorService instance) {
    injectCryDetector(instance, cryDetectorProvider.get());
    injectFaceRecognizer(instance, faceRecognizerProvider.get());
    injectAlertManager(instance, alertManagerProvider.get());
  }

  @InjectedFieldSignature("cl.babyguardian.hub.service.BabyMonitorService.cryDetector")
  public static void injectCryDetector(BabyMonitorService instance,
      CryDetectionManager cryDetector) {
    instance.cryDetector = cryDetector;
  }

  @InjectedFieldSignature("cl.babyguardian.hub.service.BabyMonitorService.faceRecognizer")
  public static void injectFaceRecognizer(BabyMonitorService instance,
      FaceRecognitionManager faceRecognizer) {
    instance.faceRecognizer = faceRecognizer;
  }

  @InjectedFieldSignature("cl.babyguardian.hub.service.BabyMonitorService.alertManager")
  public static void injectAlertManager(BabyMonitorService instance,
      AlertEscalationManager alertManager) {
    instance.alertManager = alertManager;
  }
}
