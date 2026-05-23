import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) {
        return throwError(() => err);
      }

      if (err.status === 403) {
        void router.navigate(['/unauthorized']);
      }

      if (environment.auth.enabled && err.status === 401 && !req.url.includes('/auth/me')) {
        console.warn('API returned 401; MSAL may redirect on next guarded navigation.');
      }

      return throwError(() => err);
    })
  );
};
