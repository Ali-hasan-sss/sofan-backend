"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
exports.AuthController = {
    me: async (req, res) => {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await authService_1.authService.getProfile(req.user.id);
        res.json({ user });
    },
    checkEmail: async (req, res) => {
        const result = await authService_1.authService.checkEmailAvailability(req.body);
        res.json(result);
    },
    sendVerificationCode: async (req, res) => {
        const result = await authService_1.authService.sendVerificationCode(req.body);
        res.status(201).json(result);
    },
    verifyVerificationCode: async (req, res) => {
        const result = await authService_1.authService.verifyVerificationCode(req.body);
        res.json(result);
    },
    register: async (req, res) => {
        const result = await authService_1.authService.register(req.body);
        res.status(201).json(result);
    },
    login: async (req, res) => {
        const { accessToken, refreshToken, user } = await authService_1.authService.login(req.body);
        res
            .cookie("accessToken", accessToken, { httpOnly: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true })
            .json({ user, accessToken, refreshToken });
    },
    refreshToken: async (req, res) => {
        const { refreshToken } = req.body;
        const tokens = await authService_1.authService.refresh(refreshToken);
        res.json(tokens);
    },
    logout: async (_req, res) => {
        res
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .status(204)
            .end();
    },
};
//# sourceMappingURL=authController.js.map