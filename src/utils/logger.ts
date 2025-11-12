type LogLevel = "info" | "error" | "warn" | "debug";

// Simple console-based logger for now. Can be replaced with pino/winston later.
export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  debug: (message: string, meta?: unknown) =>
    log("debug", message, meta, process.env.NODE_ENV === "development"),
};

const log = (
  level: LogLevel,
  message: string,
  meta?: unknown,
  enabled = true
) => {
  if (!enabled) return;
  const payload = meta ? JSON.stringify(meta) : "";
  // eslint-disable-next-line no-console
  console[level](
    `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message} ${payload}`
  );
};
