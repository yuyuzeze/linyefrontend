import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AppMessageIds } from '../logging/app-message-ids';
import { LoggingService } from '../logging/logging.service';
import { ApiResponse } from '../models/api-response.model';
import { NotificationService } from '../services/notification.service';

function isApiResponseBody(body: unknown): body is ApiResponse<unknown> {
  return (
    typeof body === 'object' &&
    body !== null &&
    'messages' in body &&
    'statusCode' in body
  );
}

/** 401 / 403 / 500 と ApiResponse errList トースト */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const logging = inject(LoggingService);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) {
        return throwError(() => err);
      }

      if (isApiResponseBody(err.error)) {
        notification.handleMessages(err.error.messages);
      } else if (err.status >= 500) {
        notification.showError(
          err.error?.statusDetailMessage ?? 'システムエラーが発生しました。管理者にお問い合わせください。',
          'ESYS50001'
        );
      }

      if (err.status === 403) {
        void router.navigate(['/unauthorized']);
      }

      if (environment.auth.enabled && err.status === 401 && !req.url.includes('/auth/me')) {
        logging.warn(AppMessageIds.authWarning, 'API が 401 を返しました。次回ガード付きナビゲーションで MSAL がリダイレクトする可能性があります。');
      }

      return throwError(() => err);
    })
  );
};
