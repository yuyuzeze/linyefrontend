import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  if (!environment.auth.enabled) {
    return true;
  }
  return inject(MsalGuard).canActivate(route, state);
};
