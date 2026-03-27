package cl.babyguardian.hub.service;

import cl.babyguardian.hub.data.local.HubPreferencesRepository;
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
public final class BabyFirebaseMessagingService_MembersInjector implements MembersInjector<BabyFirebaseMessagingService> {
  private final Provider<HubPreferencesRepository> hubPrefsProvider;

  public BabyFirebaseMessagingService_MembersInjector(
      Provider<HubPreferencesRepository> hubPrefsProvider) {
    this.hubPrefsProvider = hubPrefsProvider;
  }

  public static MembersInjector<BabyFirebaseMessagingService> create(
      Provider<HubPreferencesRepository> hubPrefsProvider) {
    return new BabyFirebaseMessagingService_MembersInjector(hubPrefsProvider);
  }

  @Override
  public void injectMembers(BabyFirebaseMessagingService instance) {
    injectHubPrefs(instance, hubPrefsProvider.get());
  }

  @InjectedFieldSignature("cl.babyguardian.hub.service.BabyFirebaseMessagingService.hubPrefs")
  public static void injectHubPrefs(BabyFirebaseMessagingService instance,
      HubPreferencesRepository hubPrefs) {
    instance.hubPrefs = hubPrefs;
  }
}
