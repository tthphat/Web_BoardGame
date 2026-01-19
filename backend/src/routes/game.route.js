import { Router } from "express";
import { GameController } from "../controllers/game.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

// Admin: Get all games (with auth)
router.get("/all", verifyToken, authorize("admin"), GameController.getAllGames);

// Admin: Toggle game enabled status
router.put("/toggle", verifyToken, authorize("admin"), GameController.toggleGameEnabled);

// Protected: Finish game
router.post("/finish", verifyToken, GameController.finishGame);

// Protected: Get board configs
router.get("/board-configs", verifyToken, GameController.getBoardConfigs);

export default router;

