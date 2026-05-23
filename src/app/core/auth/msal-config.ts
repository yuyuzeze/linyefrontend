import {
  BrowserCacheLocation,
  Configuration,
  IPublicClientApplication,
  InteractionType,
  LogLevel,
  PublicClientApplication
} from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

export function createMsalConfiguration(): Configuration {
  const { auth } = environment;
  return {
    auth: {
      clientId: auth.clientId,
      authority: auth.authority || `https://login.microsoftonline.com/${auth.tenantId}`,
      redirectUri: auth.redirectUri,
      postLogoutRedirectUri: auth.postLogoutRedirectUri,
      navigateToLoginRequestUrl: true
    },
    cache: {
      cacheLocation: BrowserCacheLocation.SessionStorage
    },
    system: {
      loggerOptions: {
        logLevel: environment.production ? LogLevel.Warning : LogLevel.Info
      }
    }
  };
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(createMsalConfiguration());
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: environment.auth.apiScopes
    }
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const resourceMap = new Map<string, Array<string>>();
  const apiRoot = environment.apiUrl.replace(/\/$/, '');
  resourceMap.set(`${apiRoot}/*`, environment.auth.apiScopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: resourceMap
  };
}
