package cl.babyguardian.hub.di;

import cl.babyguardian.hub.data.api.EventsApi;
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
public final class NetworkModule_ProvideEventsApiFactory implements Factory<EventsApi> {
  private final Provider<Retrofit> retrofitProvider;

  public NetworkModule_ProvideEventsApiFactory(Provider<Retrofit> retrofitProvider) {
    this.retrofitProvider = retrofitProvider;
  }

  @Override
  public EventsApi get() {
    return provideEventsApi(retrofitProvider.get());
  }

  public static NetworkModule_ProvideEventsApiFactory create(Provider<Retrofit> retrofitProvider) {
    return new NetworkModule_ProvideEventsApiFactory(retrofitProvider);
  }

  public static EventsApi provideEventsApi(Retrofit retrofit) {
    return Preconditions.checkNotNullFromProvides(NetworkModule.INSTANCE.provideEventsApi(retrofit));
  }
}
