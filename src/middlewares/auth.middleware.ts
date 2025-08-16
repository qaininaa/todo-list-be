import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

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
        throw new Error("Token Expired");
      }
      req.user = decoded;
      next();
    });
  } else {
    throw new Error("Access denied");
  }
};
