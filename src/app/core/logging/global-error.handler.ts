import { ErrorHandler, Injectable, inject } from '@angular/core';

import { AppMessageIds } from './app-message-ids';
import { LoggingService } from './logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logging = inject(LoggingService);

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : '未処理のアプリケーションエラー';
    const url = typeof window !== 'undefined' ? window.location.href : undefined;
    this.logging.error(AppMessageIds.unhandledException, message, error, url);
  }
}
