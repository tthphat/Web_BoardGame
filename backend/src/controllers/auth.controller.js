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
                throw new Error("Email and password are required");
            }

            const user = await AuthService.login(email, password);

            res.cookie("token", user.data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
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
                throw new Error("Email and password are required");
            }

            const user = await AuthService.register(email, password, username);

            res.json({
                data: {
                    user: user.data.user
                }
            });

        } catch (error) {
            next(error);
        }
    },

}
