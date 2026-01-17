import { Router } from "express";
import { AchievementController } from "../controllers/achievement.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, AchievementController.getUserAchievements);

export default router;
