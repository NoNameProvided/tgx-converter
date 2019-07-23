import { timestamp } from '../utils/console-timestamp.util';
import { LogLevel } from '../enums';

export class Logger {
  public static logLevel: LogLevel = LogLevel.INFO;

  private static writeToConsole(
    message: string,
    optionalParams: unknown[],
    logLevel: LogLevel,
    consoleFn: (message?: unknown, ...optionalParams: unknown[]) => void
  ): void {
    if (Logger.logLevel <= logLevel) {
      consoleFn(`${timestamp('[hh:mm:ss.iii]')}[${LogLevel[logLevel]}]\t${message}`, ...optionalParams);
    }
  }

  public static verbose(message: string, ...optionalParams: unknown[]): void {
    Logger.writeToConsole(message, optionalParams, LogLevel.VERBOSE, console.debug);
  }

  public static debug(message: string, ...optionalParams: unknown[]): void {
    Logger.writeToConsole(message, optionalParams, LogLevel.DEBUG, console.debug);
  }

  public static log(message: string, ...optionalParams: unknown[]): void {
    Logger.writeToConsole(message, optionalParams, LogLevel.INFO, console.log);
  }

  public static warning(message: string, ...optionalParams: unknown[]): void {
    Logger.writeToConsole(message, optionalParams, LogLevel.WARNING, console.warn);
  }

  public static error(message: string, ...optionalParams: unknown[]): void {
    Logger.writeToConsole(message, optionalParams, LogLevel.ERROR, console.error);
  }
}
