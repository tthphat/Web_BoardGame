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

            console.log(user);

            return res.status(200).json({
                message: "Login successful",
                data: {
                    user: user.data.user,
                    token: user.data.token
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

            return res.status(200).json({
                message: "Verify your email to login",
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

            console.log("Backend-Auth-Controller: Verify Email API output: ", user);

            return res.status(200).json({
                message: "Register successful",
                data: {
                    user: user.data.user,
                    token: user.data.token
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

}
