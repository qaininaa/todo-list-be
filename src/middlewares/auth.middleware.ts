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
  const authHeader =
    (req.headers?.Authorization as string) ||
    (req.headers?.authorization as string);
  const ACCESS_SECRET = process.env.ACCESS_SECRET;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  if (!authHeader?.startsWith("Bearer "))
    return res.status(400).json({ message: "Incorrect formating" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token as string, ACCESS_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Token expired",
      });
    }
    (req as Request & { user?: Decoded }).user = decoded as Decoded;
    next();
  });
};
