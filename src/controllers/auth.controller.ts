import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginDto, loginSchema } from "../validations/user.schema";
import { UserModel } from "../models/user.model";
import { UserTokenPayload } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export class AuthController {
  async login(req: Request, res: Response) {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.errors });
    }

    const { email, password } = result.data as loginDto;
    const user = await UserModel.findOne({ email }).select("+password");

    if (!user) res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user!.password);
    if (!isMatch) res.status(401).json({ error: "Invalid credentials" });

    const payload: UserTokenPayload = { id: user!.id, email: user!.email };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      user: { id: user!.id, name: user!.name, email: user!.email },
      accessToken,
      refreshToken,
    });
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token is missing" });
    }

    try {
      const payload = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET,
      ) as UserTokenPayload;

      const accessToken = jwt.sign(
        { id: payload.id, email: payload.email },
        JWT_SECRET,
        { expiresIn: "15m" },
      );

      res.status(200).json({ accessToken });
    } catch {
      res.status(401).json({ error: "Invalid or expired refresh token" });
    }
  }
}

export const authController = new AuthController();
