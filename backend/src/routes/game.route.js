import { Router } from "express";
import { GameController } from "../controllers/game.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/finish", authMiddleware, GameController.finishGame);

export default router;
