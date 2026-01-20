import express from "express";
import { AdminController } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard-stats", AdminController.getDashboardStats);
router.get("/statistics", AdminController.getStatistics);
router.get("/recent-activities", AdminController.getRecentActivities);

// Game Management
router.get("/games", AdminController.getAllGames);
router.patch("/games/:id/state", AdminController.updateGameState);

// Board Config Management
router.get("/board-configs", AdminController.getAllBoardConfigs);
router.put("/board-configs/:id", AdminController.updateBoardConfig);
router.put("/board-configs/:id/activate", AdminController.activateBoardConfig);

export default router;
