"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err, _req, res, _next) => {
    const status = err.status ?? 500;
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            message: "Validation failed",
            issues: err.flatten(),
        });
    }
    logger_1.logger.error("Request error", {
        message: err.message,
        stack: err.stack,
        details: err.details,
    });
    return res.status(status).json({
        message: err.message ?? "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map