import AuthService from "../services/auth.service.js";
import dotenv from "dotenv";
dotenv.config();


export const AuthController = {

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new Error("Email and password are required");
            }

            const { data: user, error } = await AuthService.login(email, password);
            if (error) {
                throw error;
            }

            res.cookie("token", user.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 1000
            });

            res.json({
                user: user.user
            });

        } catch (error) {
            next(error);
        }
    }


}
