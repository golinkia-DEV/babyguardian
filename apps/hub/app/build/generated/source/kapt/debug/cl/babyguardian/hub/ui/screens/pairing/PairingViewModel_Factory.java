package cl.babyguardian.hub.ui.screens.pairing;

import cl.babyguardian.hub.data.api.DevicesApi;
import cl.babyguardian.hub.data.api.HomesApi;
import cl.babyguardian.hub.data.local.HubPreferencesRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata
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
public final class PairingViewModel_Factory implements Factory<PairingViewModel> {
  private final Provider<DevicesApi> devicesApiProvider;

  private final Provider<HomesApi> homesApiProvider;

  private final Provider<HubPreferencesRepository> hubPrefsProvider;

  public PairingViewModel_Factory(Provider<DevicesApi> devicesApiProvider,
      Provider<HomesApi> homesApiProvider, Provider<HubPreferencesRepository> hubPrefsProvider) {
    this.devicesApiProvider = devicesApiProvider;
    this.homesApiProvider = homesApiProvider;
    this.hubPrefsProvider = hubPrefsProvider;
  }

  @Override
  public PairingViewModel get() {
    return newInstance(devicesApiProvider.get(), homesApiProvider.get(), hubPrefsProvider.get());
  }

  public static PairingViewModel_Factory create(Provider<DevicesApi> devicesApiProvider,
      Provider<HomesApi> homesApiProvider, Provider<HubPreferencesRepository> hubPrefsProvider) {
    return new PairingViewModel_Factory(devicesApiProvider, homesApiProvider, hubPrefsProvider);
  }

  public static PairingViewModel newInstance(DevicesApi devicesApi, HomesApi homesApi,
      HubPreferencesRepository hubPrefs) {
    return new PairingViewModel(devicesApi, homesApi, hubPrefs);
  }
}
