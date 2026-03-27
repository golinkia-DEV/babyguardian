package cl.babyguardian.hub.ui.screens.auth;

import cl.babyguardian.hub.data.api.AuthApi;
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
public final class LoginViewModel_Factory implements Factory<LoginViewModel> {
  private final Provider<AuthApi> authApiProvider;

  private final Provider<HubPreferencesRepository> hubPrefsProvider;

  public LoginViewModel_Factory(Provider<AuthApi> authApiProvider,
      Provider<HubPreferencesRepository> hubPrefsProvider) {
    this.authApiProvider = authApiProvider;
    this.hubPrefsProvider = hubPrefsProvider;
  }

  @Override
  public LoginViewModel get() {
    return newInstance(authApiProvider.get(), hubPrefsProvider.get());
  }

  public static LoginViewModel_Factory create(Provider<AuthApi> authApiProvider,
      Provider<HubPreferencesRepository> hubPrefsProvider) {
    return new LoginViewModel_Factory(authApiProvider, hubPrefsProvider);
  }

  public static LoginViewModel newInstance(AuthApi authApi, HubPreferencesRepository hubPrefs) {
    return new LoginViewModel(authApi, hubPrefs);
  }
}
