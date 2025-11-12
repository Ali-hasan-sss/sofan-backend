"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const token_1 = require("../utils/token");
const authenticate = (optional = false) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : req.cookies?.accessToken;
    if (!token) {
        if (optional) {
            return next();
        }
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const payload = (0, token_1.verifyAccessToken)(token);
        req.user = { ...payload, id: payload.id ?? payload.userId };
        return next();
    }
    catch (error) {
        if (optional)
            return next();
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map