import { Router } from "express";
import { GameController } from "../controllers/game.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/finish", verifyToken, GameController.finishGame);

export default router;
