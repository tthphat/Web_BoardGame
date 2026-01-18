import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();


router.get("/profile", UserController.getProfile);
router.patch("/profile", UserController.editProfile);


export default router;  