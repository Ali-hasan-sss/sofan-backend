"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishNotification = exports.setupWebSocket = void 0;
const ws_1 = __importStar(require("ws"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const redisClient_1 = require("../lib/redisClient");
const CHANNEL_PREFIX = "notifications:";
const setupWebSocket = (server) => {
    const wss = new ws_1.Server({ server, path: "/ws" });
    const subscriber = redisClient_1.redisClient.duplicate();
    subscriber.subscribe(`${CHANNEL_PREFIX}broadcast`, (err) => {
        if (err)
            logger_1.logger.error("Failed to subscribe to notifications", err);
    });
    subscriber.on("message", (_, message) => {
        wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(message);
            }
        });
    });
    wss.on("connection", (socket, req) => {
        try {
            const token = new URL(req.url ?? "", "http://localhost").searchParams.get("token");
            if (!token) {
                socket.close(4401, "Unauthorized");
                return;
            }
            const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
            socket.context = payload;
            logger_1.logger.info("WebSocket client connected", { userId: payload.userId });
        }
        catch (error) {
            logger_1.logger.error("WebSocket auth failed", error);
            socket.close(4401, "Unauthorized");
        }
    });
    return wss;
};
exports.setupWebSocket = setupWebSocket;
const publishNotification = async (payload) => {
    await redisClient_1.redisClient.publish(`${CHANNEL_PREFIX}broadcast`, JSON.stringify(payload));
};
exports.publishNotification = publishNotification;
//# sourceMappingURL=websocket.js.map