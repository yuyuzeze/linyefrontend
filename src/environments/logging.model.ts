export interface LoggingEnvironment {
  consoleEnabled: boolean;
  reportToApi: boolean;
  reportMinLevel: 'error' | 'warn';
  clientLogPath: string;
}
