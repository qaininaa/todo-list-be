import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth.type";

export const profileUser = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.sendStatus(401);
  return res.json({ user: req.user });
};
