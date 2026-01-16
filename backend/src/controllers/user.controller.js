import { UserService } from "../services/user.service.js";
import dotenv from "dotenv";
dotenv.config();


export const UserController = {

    // =============
    // Get User Profile
    // =============
    async getProfile(req, res, next) {
        try {
            const user = await UserService.getProfile(req.user.id);
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

