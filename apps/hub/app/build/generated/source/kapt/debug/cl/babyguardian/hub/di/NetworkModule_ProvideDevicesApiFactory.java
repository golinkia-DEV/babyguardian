package cl.babyguardian.hub.di;

import cl.babyguardian.hub.data.api.DevicesApi;
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
public final class NetworkModule_ProvideDevicesApiFactory implements Factory<DevicesApi> {
  private final Provider<Retrofit> retrofitProvider;

  public NetworkModule_ProvideDevicesApiFactory(Provider<Retrofit> retrofitProvider) {
    this.retrofitProvider = retrofitProvider;
  }

  @Override
  public DevicesApi get() {
    return provideDevicesApi(retrofitProvider.get());
  }

  public static NetworkModule_ProvideDevicesApiFactory create(Provider<Retrofit> retrofitProvider) {
    return new NetworkModule_ProvideDevicesApiFactory(retrofitProvider);
  }

  public static DevicesApi provideDevicesApi(Retrofit retrofit) {
    return Preconditions.checkNotNullFromProvides(NetworkModule.INSTANCE.provideDevicesApi(retrofit));
  }
}
