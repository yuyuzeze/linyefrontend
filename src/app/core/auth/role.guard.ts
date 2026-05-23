import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthContextService } from '../services/auth-context.service';

export const roleGuard: CanActivateFn = route => {
  const authContext = inject(AuthContextService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[] | undefined;

  return authContext.ensureLoaded().pipe(
    take(1),
    map(me => {
      if (!requiredRoles?.length) {
        return true;
      }
      if (me.roles.includes('All')) {
        return true;
      }
      const ok = requiredRoles.some(r => me.roles.includes(r));
      return ok ? true : router.createUrlTree(['/unauthorized']);
    })
  );
};
