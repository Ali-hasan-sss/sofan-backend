"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const createApp = () => {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    app.use((0, cors_1.default)({
        origin: env_1.env.BASE_URL,
        credentials: true,
    }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.get("/health", (_req, res) => {
        res.json({ status: "ok", timestamp: new Date().toISOString() });
    });
    app.use("/api", routes_1.default);
    app.use((_req, res) => {
        res.status(404).json({ message: "Not Found" });
    });
    app.use(errorHandler_1.errorHandler);
    app.on("mount", () => {
        logger_1.logger.info("Express app mounted");
    });
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map