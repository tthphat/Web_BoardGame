import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();


router.get("/profile", UserController.getProfile);
router.patch("/profile", UserController.editProfile);
router.get("/me", UserController.getMe);
router.get("/all", UserController.getAllUsers);
router.patch("/:id/state", UserController.updateUserState);
router.get("/friend-requests", UserController.getFriendRequests);


export default router;  