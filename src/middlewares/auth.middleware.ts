import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface Decoded {
  username: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization =
    req.headers?.Authorization || req.headers?.authorization;
  const ACCESS_SECRET = process.env.ACCESS_SECRET;

  if (
    typeof authorization === "string" &&
    authorization?.startsWith("Bearer ")
  ) {
    const token = authorization.split(" ")[1];

    jwt.verify(token as string, ACCESS_SECRET as string, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Token expired",
        });
      }
      (req as Request & { user?: Decoded }).user = decoded as Decoded;
      next();
    });
  } else {
    return res.status(401).json({
      message: "Access denied",
    });
  }
};
