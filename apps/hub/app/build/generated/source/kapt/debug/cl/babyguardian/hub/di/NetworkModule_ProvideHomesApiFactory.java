package cl.babyguardian.hub.di;

import cl.babyguardian.hub.data.api.HomesApi;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;
import retrofit2.Retrofit;

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
public final class NetworkModule_ProvideHomesApiFactory implements Factory<HomesApi> {
  private final Provider<Retrofit> retrofitProvider;

  public NetworkModule_ProvideHomesApiFactory(Provider<Retrofit> retrofitProvider) {
    this.retrofitProvider = retrofitProvider;
  }

  @Override
  public HomesApi get() {
    return provideHomesApi(retrofitProvider.get());
  }

  public static NetworkModule_ProvideHomesApiFactory create(Provider<Retrofit> retrofitProvider) {
    return new NetworkModule_ProvideHomesApiFactory(retrofitProvider);
  }

  public static HomesApi provideHomesApi(Retrofit retrofit) {
    return Preconditions.checkNotNullFromProvides(NetworkModule.INSTANCE.provideHomesApi(retrofit));
  }
}
