import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalService
} from '@azure/msal-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { environment } from '../environments/environment';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory
} from './core/auth/msal-config';
import { msalBootstrapFactory } from './core/auth/msal-bootstrap';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { loggingInterceptor } from './core/logging/logging.interceptor';
import { GlobalErrorHandler } from './core/logging/global-error.handler';
import { AuthContextService } from './core/services/auth-context.service';

function authContextInitializer(auth: AuthContextService): () => Promise<void> {
  return () =>
    firstValueFrom(auth.ensureLoaded())
      .then(() => undefined)
      .catch(() => undefined);
}

const msalProviders = environment.auth.enabled
  ? [
      { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
      { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
      { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
      MsalService,
      MsalGuard,
      MsalBroadcastService,
      { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
      {
        provide: APP_INITIALIZER,
        useFactory: msalBootstrapFactory,
        deps: [MSAL_INSTANCE],
        multi: true
      }
    ]
  : [];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true
    }),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([errorInterceptor, loadingInterceptor, loggingInterceptor])
    ),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    ...msalProviders,
    {
      provide: APP_INITIALIZER,
      useFactory: authContextInitializer,
      deps: [AuthContextService],
      multi: true
    }
  ]
};
