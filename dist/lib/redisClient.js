"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
exports.redisClient = new ioredis_1.default(env_1.env.REDIS_URI);
exports.redisClient.on("connect", () => logger_1.logger.info("Redis connected"));
exports.redisClient.on("error", (error) => logger_1.logger.error("Redis error", error));
//# sourceMappingURL=redisClient.js.map