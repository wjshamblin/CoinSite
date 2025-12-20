/**
 * Simple logging utility for the CoinSite application.
 *
 * Provides structured logging with different log levels,
 * timestamps, and context information.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
}

// Determine if we're in production mode
const isProduction = import.meta.env?.PROD ?? process.env.NODE_ENV === 'production';

// Minimum log level based on environment
const minLevel: LogLevel = isProduction ? 'info' : 'debug';

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] >= levelPriority[minLevel];
}

function formatLogEntry(entry: LogEntry): string {
  const { timestamp, level, message, context } = entry;
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (context && Object.keys(context).length > 0) {
    return `${prefix} ${message} ${JSON.stringify(context)}`;
  }

  return `${prefix} ${message}`;
}

function createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };
}

function log(level: LogLevel, message: string, context?: LogContext): void {
  if (!shouldLog(level)) return;

  const entry = createLogEntry(level, message, context);
  const formatted = formatLogEntry(entry);

  switch (level) {
    case 'debug':
      console.debug(formatted);
      break;
    case 'info':
      console.info(formatted);
      break;
    case 'warn':
      console.warn(formatted);
      break;
    case 'error':
      console.error(formatted);
      break;
  }
}

/**
 * Logger object with methods for each log level.
 *
 * @example
 * logger.info('User logged in', { userId: 123 });
 * logger.error('Failed to process request', { error: err.message });
 */
export const logger = {
  /**
   * Log debug information (development only)
   */
  debug: (message: string, context?: LogContext) => log('debug', message, context),

  /**
   * Log general information
   */
  info: (message: string, context?: LogContext) => log('info', message, context),

  /**
   * Log warning messages
   */
  warn: (message: string, context?: LogContext) => log('warn', message, context),

  /**
   * Log error messages
   */
  error: (message: string, context?: LogContext) => log('error', message, context),

  /**
   * Create a child logger with default context
   */
  child: (defaultContext: LogContext) => ({
    debug: (message: string, context?: LogContext) =>
      log('debug', message, { ...defaultContext, ...context }),
    info: (message: string, context?: LogContext) =>
      log('info', message, { ...defaultContext, ...context }),
    warn: (message: string, context?: LogContext) =>
      log('warn', message, { ...defaultContext, ...context }),
    error: (message: string, context?: LogContext) =>
      log('error', message, { ...defaultContext, ...context }),
  }),
};

// Request logging utilities
export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number
): void {
  const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';

  log(level, `${method} ${path} ${statusCode}`, {
    method,
    path,
    statusCode,
    durationMs,
  });
}

// Authentication logging
export const authLogger = logger.child({ module: 'auth' });

// Admin logging
export const adminLogger = logger.child({ module: 'admin' });

// Database logging
export const dbLogger = logger.child({ module: 'database' });
