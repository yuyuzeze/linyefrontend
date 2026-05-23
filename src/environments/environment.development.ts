import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  apiUrl: '/api',
  auth: {
    enabled: false,
    useSilentSso: false,
    clientId: '',
    tenantId: '',
    authority: '',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
    apiScopes: []
  }
};
