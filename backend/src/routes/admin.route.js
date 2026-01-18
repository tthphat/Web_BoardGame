import express from "express";
import { AdminController } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard-stats", AdminController.getDashboardStats);
router.get("/recent-activities", AdminController.getRecentActivities);

export default router;
