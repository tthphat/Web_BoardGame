import { AuthService } from "../services/auth.service.js";
import dotenv from "dotenv";
dotenv.config();


export const AuthController = {

    // =============
    // Login
    // =============
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
            }

            const user = await AuthService.login(email, password);

            res.cookie("access_token", user.data.token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000
            });

            console.log(user);

            res.json({
                data: {
                    user: user.data.user
                }
            });

        } catch (error) {
            next(error);
        }
    },

    // =============
    // Register
    // =============
    async register(req, res, next) {
        try {
            const { email, password, username } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email and password are required" });
            }

            const user = await AuthService.register(email, password, username);

            console.log("Backend-Auth-Controller: Register API output: ", user);

            res.json({
                data: {
                    user: user.data.user
                }
            });

        } catch (error) {
            next(error);
        }
    },

    // =============
    // Verify Email
    // =============
    async verifyEmail(req, res, next) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ error: "Email and OTP are required" });
            }

            const user = await AuthService.verifyEmail(email, otp);

            res.cookie("access_token", user.data.token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000
            });

            console.log("Backend-Auth-Controller: Verify Email API output: ", user);

            res.json({
                data: {
                    user: user.data.user
                }
            });

        } catch (error) {
            next(error);
        }
    },

    // resend OTP
    async resendOtp(req, res, next) {
        try {
            const { email } = req.body;
            console.log("Backend-Auth-Controller: Resend OTP API input: ", { email });

            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }

            await AuthService.resendOtp(email);

            res.json({
                message: "OTP sent successfully"
            });

        } catch (error) {
            next(error);
        }
    },

    // =============
    // Logout
    // =============
    async logout(req, res, next) {
        try {
            res.clearCookie("access_token");
            res.json({
                message: "Logout successfully"
            });
        } catch (error) {
            next(error);
        }
    },
}
