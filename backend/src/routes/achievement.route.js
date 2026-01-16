import { Router } from "express";
import { AchievementController } from "../controllers/achievement.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, AchievementController.getUserAchievements);

export default router;
