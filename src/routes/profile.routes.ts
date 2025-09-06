import express from "express";
import * as profileController from "../controllers/profile.controller";

const router: express.Router = express.Router();

router.get("/user", profileController.profileUser);

export default router;
