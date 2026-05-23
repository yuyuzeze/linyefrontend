import { IPublicClientApplication } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';

export function msalBootstrapFactory(instance: IPublicClientApplication): () => Promise<void> {
  return async () => {
    if (!environment.auth.enabled) {
      return;
    }

    await instance.initialize();

    const accounts = instance.getAllAccounts();
    if (accounts.length > 0) {
      try {
        await instance.acquireTokenSilent({
          scopes: environment.auth.apiScopes,
          account: accounts[0]
        });
        return;
      } catch {
        // fall through to ssoSilent or interactive login via guard
      }
    }

    if (!environment.auth.useSilentSso) {
      return;
    }

    try {
      await instance.ssoSilent({ scopes: environment.auth.apiScopes });
    } catch (err) {
      console.warn('ssoSilent failed; user may need interactive login.', err);
    }
  };
}
