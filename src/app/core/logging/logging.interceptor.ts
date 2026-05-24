import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AppMessageIds } from './app-message-ids';
import { LoggingService } from './logging.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logging = inject(LoggingService);

  if (req.url.includes('/client-log')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) {
        logging.error(AppMessageIds.businessError, 'HTTP リクエストが不明なエラーで失敗しました。', err, req.url);
        return throwError(() => err);
      }

      if (err.status === 0) {
        logging.error(
          AppMessageIds.businessError,
          `${req.method} ${req.urlWithParams} 呼び出しでネットワークエラー`,
          err,
          req.urlWithParams
        );
      } else if (err.status >= 500) {
        logging.error(
          AppMessageIds.businessError,
          `${req.method} ${req.urlWithParams} でサーバーエラー ${err.status}`,
          err,
          req.urlWithParams
        );
      } else if (err.status >= 400) {
        logging.warn(
          AppMessageIds.warning,
          `${req.method} ${req.urlWithParams} でクライアントエラー ${err.status}`,
          err.message
        );
      }

      return throwError(() => err);
    })
  );
};
