"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// Simple console-based logger for now. Can be replaced with pino/winston later.
exports.logger = {
    info: (message, meta) => log("info", message, meta),
    error: (message, meta) => log("error", message, meta),
    warn: (message, meta) => log("warn", message, meta),
    debug: (message, meta) => log("debug", message, meta, process.env.NODE_ENV === "development"),
};
const log = (level, message, meta, enabled = true) => {
    if (!enabled)
        return;
    const payload = meta ? JSON.stringify(meta) : "";
    // eslint-disable-next-line no-console
    console[level](`[${new Date().toISOString()}] [${level.toUpperCase()}] ${message} ${payload}`);
};
//# sourceMappingURL=logger.js.map