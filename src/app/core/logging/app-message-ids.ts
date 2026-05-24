export const AppMessageIds = {
  information: 'APP-I001',
  httpRequest: 'APP-I010',
  warning: 'APP-W001',
  authWarning: 'APP-W002',
  businessError: 'APP-E001',
  clientReport: 'APP-E901',
  unhandledException: 'APP-F001'
} as const;

export type LogLevelName = 'debug' | 'info' | 'warn' | 'error';

export interface ClientLogPayload {
  level: 'Error' | 'Critical' | 'Fatal';
  messageId: string;
  message: string;
  url?: string;
  stack?: string;
}