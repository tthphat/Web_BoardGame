import Router from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


router.get("/profile", verifyToken, UserController.getProfile);



export default router;  