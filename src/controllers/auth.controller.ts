import { Request, Response } from "express";
import * as authService from "../services/auth.service";

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
      sameSite: "none",
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
