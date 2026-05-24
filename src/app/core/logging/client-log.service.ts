import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, catchError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AppMessageIds, ClientLogPayload } from './app-message-ids';

@Injectable({ providedIn: 'root' })
export class ClientLogService {
  private readonly http = inject(HttpClient);

  report(payload: ClientLogPayload): void {
    if (!environment.logging.reportToApi) {
      return;
    }

    const url = `${environment.apiUrl}${environment.logging.clientLogPath}`;
    this.http
      .post(url, payload)
      .pipe(catchError(() => EMPTY))
      .subscribe();
  }

  buildPayload(
    message: string,
    messageId: string = AppMessageIds.clientReport,
    url?: string,
    stack?: string
  ): ClientLogPayload {
    return {
      level: 'Error',
      messageId,
      message,
      url,
      stack
    };
  }
}
