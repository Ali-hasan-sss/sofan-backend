"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const normalizeExpiresIn = (value) => {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
        return Number(trimmed);
    }
    if (/^\d+\s*[a-zA-Z]+$/.test(trimmed)) {
        return trimmed;
    }
    throw new Error(`Invalid expiresIn format: ${value}`);
};
const accessTokenExpiry = normalizeExpiresIn(env_1.env.ACCESS_TOKEN_TTL);
const refreshTokenExpiry = normalizeExpiresIn(env_1.env.REFRESH_TOKEN_TTL);
const signAccessToken = (payload) => jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACCESS_SECRET, { expiresIn: accessTokenExpiry });
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => jsonwebtoken_1.default.sign(payload, env_1.env.JWT_REFRESH_SECRET, { expiresIn: refreshTokenExpiry });
exports.signRefreshToken = signRefreshToken;
const verifyAccessToken = (token) => jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_SECRET);
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=token.js.map