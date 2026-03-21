type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

const isDev = process.env.NODE_ENV === 'development';

function log(level: LogLevel, event: string, ctx?: LogContext) {
  const entry = { ts: new Date().toISOString(), level, event, ...ctx };
  if (!isDev) {
    if (level === 'error' || level === 'warn') console.error(JSON.stringify(entry));
    else console.log(JSON.stringify(entry));
    return;
  }
  const prefix = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' }[level];
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  fn(`${prefix} [${entry.ts}] ${event}`, ctx ?? '');
}

export const logger = {
  debug: (event: string, ctx?: LogContext) => isDev && log('debug', event, ctx),
  info:  (event: string, ctx?: LogContext) => log('info',  event, ctx),
  warn:  (event: string, ctx?: LogContext) => log('warn',  event, ctx),
  error: (event: string, err?: unknown, ctx?: LogContext) => {
    const errCtx: LogContext = {
      ...(err instanceof Error ? { message: err.message, stack: err.stack } : { err }),
      ...ctx,
    };
    log('error', event, errCtx);
  },
};

export type ActionResult<T = void> =
  | { ok: true;  data: T }
  | { ok: false; error: string; code?: string };

export function ok<T>(data: T): ActionResult<T>     { return { ok: true,  data }; }
export function err(error: string, code?: string): ActionResult<never> { return { ok: false, error, code }; }

// API response helpers — only import NextResponse where needed
export function apiOk<T>(data: T, status = 200) {
  const { NextResponse } = require('next/server');
  return NextResponse.json({ ok: true, data }, { status });
}

export function apiErr(message: string, status = 400, code?: string) {
  const { NextResponse } = require('next/server');
  return NextResponse.json({ ok: false, error: message, code }, { status });
}
