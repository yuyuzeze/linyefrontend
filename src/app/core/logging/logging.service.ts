import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';
import { AppMessageIds, LogLevelName } from './app-message-ids';
import { ClientLogService } from './client-log.service';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly clientLog = inject(ClientLogService);
  private readonly recentReports = new Set<string>();
  private readonly reportDedupeMs = 5000;

  debug(messageId: string, message: string, ...details: unknown[]): void {
    this.write('debug', messageId, message, details);
  }

  info(messageId: string, message: string, ...details: unknown[]): void {
    this.write('info', messageId, message, details);
  }

  warn(messageId: string, message: string, ...details: unknown[]): void {
    this.write('warn', messageId, message, details);
  }

  error(messageId: string, message: string, error?: unknown, url?: string): void {
    const stack = this.extractStack(error);
    this.write('error', messageId, message, error ? [error] : [], stack);

    if (this.shouldReport('error')) {
      this.reportToServer(messageId, message, url, stack);
    }
  }

  private write(level: LogLevelName, messageId: string, message: string, details: unknown[], stack?: string): void {
    if (!environment.logging.consoleEnabled && environment.production) {
      return;
    }

    if (!environment.logging.consoleEnabled && level === 'debug') {
      return;
    }

    const formatted = `[${messageId}] ${message}`;
    const args = details.length > 0 ? details : undefined;

    switch (level) {
      case 'debug':
        console.debug(formatted, ...(args ?? []));
        break;
      case 'info':
        console.info(formatted, ...(args ?? []));
        break;
      case 'warn':
        console.warn(formatted, ...(args ?? []));
        break;
      case 'error':
        if (stack) {
          console.error(formatted, ...(args ?? []), stack);
        } else {
          console.error(formatted, ...(args ?? []));
        }
        break;
    }
  }

  private shouldReport(level: LogLevelName): boolean {
    if (!environment.logging.reportToApi) {
      return false;
    }

    if (environment.logging.reportMinLevel === 'warn') {
      return level === 'warn' || level === 'error';
    }

    return level === 'error';
  }

  private reportToServer(messageId: string, message: string, url?: string, stack?: string): void {
    const key = `${messageId}:${message}:${url ?? ''}`;
    if (this.recentReports.has(key)) {
      return;
    }

    this.recentReports.add(key);
    queueMicrotask(() => {
      this.clientLog.report(this.clientLog.buildPayload(message, messageId, url, stack));
      window.setTimeout(() => this.recentReports.delete(key), this.reportDedupeMs);
    });
  }

  private extractStack(error: unknown): string | undefined {
    if (!error) {
      return undefined;
    }

    if (error instanceof Error) {
      return error.stack;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }
}

export { AppMessageIds };
