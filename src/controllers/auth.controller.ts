import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import jwt from "jsonwebtoken";
import { UserType } from "../types/auth.type";

export interface UserData {
  username: string;
  password: string;
  email: string;
  name: string;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const body: UserData = req.body;
    const data = await authService.registerUser(body);

    res.json({
      message: "Success register",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed create user",
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { body } = req as { body: UserLoginData };
    const { accessToken, refreshToken } = await authService.loginUser(body);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 5 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed create user",
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }
};

export const refreshAccess = (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  const ACCESS_SECRET = process.env.ACCESS_SECRET;
  const REFRESH_SECRET = process.env.REFRESH_SECRET;

  if (!refreshToken) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const decoded = jwt.verify(
    refreshToken as string,
    REFRESH_SECRET as string
  ) as UserType;

  if (!decoded) return res.sendStatus(403);

  const payload = {
    name: decoded.name,
    username: decoded.username,
    email: decoded.email,
  };

  jwt.sign(
    payload,
    ACCESS_SECRET as string,
    { expiresIn: "1m" },
    (err, token) => {
      if (err || !token) {
        console.log(err);
      }

      res.json({ accessToken: token });
    }
  );
};

export const clearRefresh = (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "No token provided",
    });
  }
  res.clearCookie("refreshToken");
  res.end();
};
