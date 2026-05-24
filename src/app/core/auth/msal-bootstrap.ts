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
        // ssoSilent またはガード経由の対話ログインへフォールスルー
      }
    }

    if (!environment.auth.useSilentSso) {
      return;
    }

    try {
      await instance.ssoSilent({ scopes: environment.auth.apiScopes });
    } catch (err) {
      console.warn('ssoSilent に失敗しました。対話ログインが必要な場合があります。', err);
    }
  };
}
