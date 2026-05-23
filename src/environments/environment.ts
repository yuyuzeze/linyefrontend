import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: true,
  apiUrl: 'https://linyedemo-d3epf9hearafhdg5.japaneast-01.azurewebsites.net/api',
  auth: {
    enabled: true,
    useSilentSso: true,
    clientId: '<SPA_APP_CLIENT_ID>',
    tenantId: '<YOUR_TENANT_ID>',
    authority: 'https://login.microsoftonline.com/<YOUR_TENANT_ID>',
    redirectUri: 'https://linyedemo-d3epf9hearafhdg5.japaneast-01.azurewebsites.net/',
    postLogoutRedirectUri: 'https://linyedemo-d3epf9hearafhdg5.japaneast-01.azurewebsites.net/',
    apiScopes: ['api://<API_APP_CLIENT_ID>/access_as_user']
  }
};
