import { Injectable } from '@angular/core';
// import { environment } from '../../environments/environment';

export enum LogLevel {
  NONE = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
//   private currentLogLevel: LogLevel;

  constructor() {
    // Set log level based on environment
    // if (environment.production) {
    //   this.currentLogLevel = environment.enableConsoleLogs ? LogLevel.INFO : LogLevel.ERROR;
    // } else {
    //   this.currentLogLevel = environment.enableDebugMode ? LogLevel.DEBUG : LogLevel.INFO;
    // }
  }

  /**
   * Set the current log level
   */
//   setLogLevel(level: LogLevel): void {
//     this.currentLogLevel = level;
//   }

  /**
   * Get the current log level
   */
//   getLogLevel(): LogLevel {
//     return this.currentLogLevel;
//   }

  /**
   * Log debug messages
   */
//   debug(message: string, ...args: any[]): void {
//     if (this.currentLogLevel >= LogLevel.DEBUG) {
//       console.debug(`[DEBUG] ${message}`, ...args);
//     }
//   }

  /**
   * Log info messages
   */
  info(message: string, ...args: any[]): void {
    // if (this.currentLogLevel >= LogLevel.INFO) {
    //   console.info(`[INFO] ${message}`, ...args);
    // }
  }

  /**
   * Log warning messages
   */
  warn(message: string, ...args: any[]): void {
    // if (this.currentLogLevel >= LogLevel.WARN) {
    //   console.warn(`[WARN] ${message}`, ...args);
    // }
  }

  /**
   * Log error messages
   */
  error(message: string, error?: any, ...args: any[]): void {
    // if (this.currentLogLevel >= LogLevel.ERROR) {
    //   if (error) {
    //     console.error(`[ERROR] ${message}`, error, ...args);
    //   } else {
    //     console.error(`[ERROR] ${message}`, ...args);
    //   }
    // }
  }

  /**
   * Log with custom level
   */
  log(level: LogLevel, message: string, ...args: any[]): void {
    // switch (level) {
    //   case LogLevel.DEBUG:
    //     this.debug(message, ...args);
    //     break;
    //   case LogLevel.INFO:
    //     this.info(message, ...args);
    //     break;
    //   case LogLevel.WARN:
    //     this.warn(message, ...args);
    //     break;
    //   case LogLevel.ERROR:
    //     this.error(message, ...args);
    //     break;
    //   default:
    //     break;
    // }
  }

  /**
   * Create a child logger with a prefix
   */
  createChild(prefix: string): ChildLogger {
    return new ChildLogger(this, prefix);
  }
}

/**
 * Child logger class for component/service specific logging
 */
export class ChildLogger {
  constructor(
    private parentLogger: LoggerService,
    private prefix: string
  ) {}

  debug(message: string, ...args: any[]): void {
    // this.parentLogger.debug(`[${this.prefix}] ${message}`, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.parentLogger.info(`[${this.prefix}] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.parentLogger.warn(`[${this.prefix}] ${message}`, ...args);
  }

  error(message: string, error?: any, ...args: any[]): void {
    this.parentLogger.error(`[${this.prefix}] ${message}`, error, ...args);
  }

  log(level: LogLevel, message: string, ...args: any[]): void {
    this.parentLogger.log(level, `[${this.prefix}] ${message}`, ...args);
  }
}