package cl.babyguardian.hub.service;

import cl.babyguardian.hub.data.api.EventsApi;
import cl.babyguardian.hub.data.local.HubPreferencesRepository;
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
public final class AlertEscalationManager_Factory implements Factory<AlertEscalationManager> {
  private final Provider<HubPreferencesRepository> hubPrefsProvider;

  private final Provider<EventsApi> eventsApiProvider;

  public AlertEscalationManager_Factory(Provider<HubPreferencesRepository> hubPrefsProvider,
      Provider<EventsApi> eventsApiProvider) {
    this.hubPrefsProvider = hubPrefsProvider;
    this.eventsApiProvider = eventsApiProvider;
  }

  @Override
  public AlertEscalationManager get() {
    return newInstance(hubPrefsProvider.get(), eventsApiProvider.get());
  }

  public static AlertEscalationManager_Factory create(
      Provider<HubPreferencesRepository> hubPrefsProvider, Provider<EventsApi> eventsApiProvider) {
    return new AlertEscalationManager_Factory(hubPrefsProvider, eventsApiProvider);
  }

  public static AlertEscalationManager newInstance(HubPreferencesRepository hubPrefs,
      EventsApi eventsApi) {
    return new AlertEscalationManager(hubPrefs, eventsApi);
  }
}
