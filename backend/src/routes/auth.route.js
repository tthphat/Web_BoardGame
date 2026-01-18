import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/logout", AuthController.logout);

export default router;  