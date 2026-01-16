import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();


router.get("/profile", verifyToken, UserController.getProfile);
router.patch("/profile", verifyToken, UserController.editProfile);


export default router;  