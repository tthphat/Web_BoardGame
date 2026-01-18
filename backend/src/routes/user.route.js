import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();


router.get("/profile", UserController.getProfile);
router.patch("/profile", UserController.editProfile);
router.get("/me", UserController.getMe);
router.get("/all", UserController.getAllUsers);
router.get("/friend-requests", UserController.getFriendRequests);
router.get("/my-friends", UserController.getMyFriends);


export default router;  