import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        username: string;
        email: string;
        name: string;
        // tambahkan field lain sesuai JWT kamu
      };
    }
  }
}
