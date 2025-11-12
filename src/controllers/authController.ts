import { Request, Response } from "express";
import { authService } from "../services/authService";

export const AuthController = {
  me: async (req: Request, res: Response) => {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await authService.getProfile(req.user.id);
    res.json({ user });
  },

  checkEmail: async (req: Request, res: Response) => {
    const result = await authService.checkEmailAvailability(req.body);
    res.json(result);
  },

  sendVerificationCode: async (req: Request, res: Response) => {
    const result = await authService.sendVerificationCode(req.body);
    res.status(201).json(result);
  },

  verifyVerificationCode: async (req: Request, res: Response) => {
    const result = await authService.verifyVerificationCode(req.body);
    res.json(result);
  },

  register: async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  },

  login: async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await authService.login(
      req.body
    );

    res
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .json({ user, accessToken, refreshToken });
  },

  refreshToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refresh(refreshToken);
    res.json(tokens);
  },

  logout: async (_req: Request, res: Response) => {
    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(204)
      .end();
  },
};
