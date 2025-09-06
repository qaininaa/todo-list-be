import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import jwt from "jsonwebtoken";
import { UserType } from "../types/auth.type";

/**
 * Interface for user registration data.
 */
export interface UserData {
  username: string;
  password: string;
  email: string;
  name: string;
}

/**
 * Interface for user login data.
 */
export interface UserLoginData {
  username: string;
  password: string;
}

/**
 * Registers a new user.
 * @param req - The request object containing user data in the body.
 * @param res - The response object.
 * @returns A JSON response with success message and user data, or an error message.
 */
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

/**
 * Logs in a user and sets a refresh token cookie.
 * @param req - The request object containing login data in the body.
 * @param res - The response object.
 * @returns A JSON response with access token, or an error message.
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { body } = req as { body: UserLoginData };
    const { accessToken, refreshToken } = await authService.loginUser(body);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1 * 60 * 1000,
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

/**
 * Refreshes the access token using the refresh token and generates a new refresh token.
 * @param req - The request object, expecting a refresh token in cookies.
 * @param res - The response object.
 * @returns A JSON response with new access token, or an error status.
 */
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

  const newRefreshToken = jwt.sign(payload, REFRESH_SECRET as string, {
    expiresIn: "5d",
  });

  jwt.sign(
    payload,
    ACCESS_SECRET as string,
    { expiresIn: "1m" },
    (err, token) => {
      if (err || !token) {
        console.log(err);
      }

      res.cookie("refreshToken", newRefreshToken, {
        maxAge: 5 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.json({ accessToken: token });
    }
  );
};

/**
 * Clears the refresh token cookie.
 * @param req - The request object, expecting a refresh token in cookies.
 * @param res - The response object.
 * @returns Ends the response after clearing the cookie, or an error status.
 */
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
