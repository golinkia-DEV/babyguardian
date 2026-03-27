package cl.babyguardian.hub.data.local;

import android.content.Context;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata("dagger.hilt.android.qualifiers.ApplicationContext")
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
public final class HubPreferencesRepository_Factory implements Factory<HubPreferencesRepository> {
  private final Provider<Context> contextProvider;

  public HubPreferencesRepository_Factory(Provider<Context> contextProvider) {
    this.contextProvider = contextProvider;
  }

  @Override
  public HubPreferencesRepository get() {
    return newInstance(contextProvider.get());
  }

  public static HubPreferencesRepository_Factory create(Provider<Context> contextProvider) {
    return new HubPreferencesRepository_Factory(contextProvider);
  }

  public static HubPreferencesRepository newInstance(Context context) {
    return new HubPreferencesRepository(context);
  }
}
