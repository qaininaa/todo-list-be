import { Request, Response } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    username: string;
    email: string;
    name: string;
    iat: number;
    exp: number;
  };
}

export const profileUser = (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user) {
      res.json({
        message: "Success",
        data: req.user,
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
