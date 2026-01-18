import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();


router.get("/profile", UserController.getProfile);
router.patch("/profile", UserController.editProfile);
router.get("/me", UserController.getMe);


export default router;  