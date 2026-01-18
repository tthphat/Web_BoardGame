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

    // =============
    // Edit User Profile
    // =============
    async editProfile(req, res, next) {
        try {
            const editData = req.body;
            const user = await UserService.editProfile(req.user.id, editData);
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
    // Get User, remember me
    // =============
    async getMe(req, res, next) {
        try {
            const user = await UserService.getMe(req.user.id);
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

