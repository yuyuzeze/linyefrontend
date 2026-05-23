export interface AuthEnvironment {
  enabled: boolean;
  useSilentSso: boolean;
  clientId: string;
  tenantId: string;
  authority: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  apiScopes: string[];
}

export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  auth: AuthEnvironment;
}
