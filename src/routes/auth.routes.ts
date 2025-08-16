import express from "express";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh", authController.refreshAccess);

export default router;
