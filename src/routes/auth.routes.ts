import express from "express";
import * as authController from "../controllers/auth.controller";

const router: express.Router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/refresh", authController.refreshAccess);
router.get("/clear", authController.clearRefresh);

export default router;
