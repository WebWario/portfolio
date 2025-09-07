import {Injectable} from '@angular/core';


@Injectable(
  {providedIn: 'root'}
)
export class LoggerService implements Logger{

  log(message: string, level: SERVICELOGLEVEL): void {

    const log = this.formatLogMessage(message, level);

    switch (level){
      case SERVICELOGLEVEL.Info:
        console.info(log);
        break;
      case SERVICELOGLEVEL.Warning:
        console.warn(log);
        break;
      case SERVICELOGLEVEL.Error:
        console.error(log);
        break;
      case SERVICELOGLEVEL.Debug:
        console.debug(log);
        break;
      case SERVICELOGLEVEL.Critical:
        console.error(log);
        break;
      case SERVICELOGLEVEL.Trace:
        console.trace(log);
        break;
      default:
        console.log(this.formatLogMessage(message, level));

    }
    console.log(this.formatLogMessage(message, level));
  }

  private formatLogMessage(message: string, level: SERVICELOGLEVEL): string{
    return `${new Date().toLocaleString()} || ${LoggerService.name} ||  ${level}-${message}`
  }
}

/**
 * Abstract logger class.
 * Implements the log method.
 * */
export abstract class Logger{
}

/**
 * LogLevel for LoggerService.
 *
 * Info = 0
 * Warning = 1
 * Error = 2
 * Debug = 3
 * Trace = 4
 * Critical = 5
 *
 * */
export enum SERVICELOGLEVEL{
  Info = 0,
  Warning = 1,
  Error = 2,
  Debug = 3,
  Trace = 4,
  Critical = 5
}
