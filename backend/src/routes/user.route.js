import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();


router.get("/profile", UserController.getProfile);
router.patch("/profile", UserController.editProfile);

router.get("/me", UserController.getMe);
router.get("/all", UserController.getAllUsers);
router.patch("/:id/state", UserController.updateUserState);

router.get("/all-users", UserController.getAllUsersFriend);
router.get("/friend-requests", UserController.getFriendRequests);
router.get("/my-friends", UserController.getMyFriends);
router.post("/add-friend", UserController.addFriend);
router.post("/accept-friend", UserController.acceptFriend);
router.post("/reject-friend", UserController.rejectFriend);
router.post("/remove-friend", UserController.removeFriend);
router.get("/all-my-conversations", UserController.getAllMyConversations);


export default router;  