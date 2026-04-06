package cl.babyguardian.hub.di;

import cl.babyguardian.hub.data.local.HubPreferencesRepository;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;
import okhttp3.Interceptor;

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
public final class NetworkModule_ProvideAuthInterceptorFactory implements Factory<Interceptor> {
  private final Provider<HubPreferencesRepository> prefsProvider;

  public NetworkModule_ProvideAuthInterceptorFactory(
      Provider<HubPreferencesRepository> prefsProvider) {
    this.prefsProvider = prefsProvider;
  }

  @Override
  public Interceptor get() {
    return provideAuthInterceptor(prefsProvider.get());
  }

  public static NetworkModule_ProvideAuthInterceptorFactory create(
      Provider<HubPreferencesRepository> prefsProvider) {
    return new NetworkModule_ProvideAuthInterceptorFactory(prefsProvider);
  }

  public static Interceptor provideAuthInterceptor(HubPreferencesRepository prefs) {
    return Preconditions.checkNotNullFromProvides(NetworkModule.INSTANCE.provideAuthInterceptor(prefs));
  }
}
