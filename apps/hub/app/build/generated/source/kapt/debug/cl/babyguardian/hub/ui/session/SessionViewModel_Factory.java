package cl.babyguardian.hub.ui.session;

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
public final class SessionViewModel_Factory implements Factory<SessionViewModel> {
  private final Provider<HubPreferencesRepository> hubPrefsProvider;

  public SessionViewModel_Factory(Provider<HubPreferencesRepository> hubPrefsProvider) {
    this.hubPrefsProvider = hubPrefsProvider;
  }

  @Override
  public SessionViewModel get() {
    return newInstance(hubPrefsProvider.get());
  }

  public static SessionViewModel_Factory create(
      Provider<HubPreferencesRepository> hubPrefsProvider) {
    return new SessionViewModel_Factory(hubPrefsProvider);
  }

  public static SessionViewModel newInstance(HubPreferencesRepository hubPrefs) {
    return new SessionViewModel(hubPrefs);
  }
}
