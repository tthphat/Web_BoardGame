import { Router } from "express";
import { GameController } from "../controllers/game.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

import { GameSessionController } from "../controllers/gameSession.controller.js";

const router = Router();

// Admin: Get all games (with auth)
router.get("/all", verifyToken, authorize("admin"), GameController.getAllGames);

// Admin: Toggle game enabled status
router.put("/toggle", verifyToken, authorize("admin"), GameController.toggleGameEnabled);

// Protected: Get user's game stats
router.get("/my-stats", verifyToken, GameController.getUserStats);

// Protected: Get user's stats for a specific game
router.get("/my-stats/:slug", verifyToken, GameController.getGameStats);

// Protected: Finish game
router.post("/finish", verifyToken, GameController.finishGame);

// Protected: Get board configs
router.get("/board-configs", verifyToken, GameController.getBoardConfigs);

// Protected: Save game session
router.post("/save", verifyToken, GameSessionController.saveSession);

// Protected: Load game session
router.get("/load/:slug", verifyToken, GameSessionController.loadSession);

export default router;


