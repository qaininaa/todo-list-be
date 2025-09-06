import { Request } from "express";

export type UserType = {
  username: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};
export interface AuthenticatedRequest extends Request {
  user?: UserType;
}
