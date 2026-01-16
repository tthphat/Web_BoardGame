import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


export const UserService = {
    // =============
    // Get Profile
    // =============
    async getProfile(id) {
        try {
            const { data: user, error } = await UserModel.findUserById(id);
            if (error || !user) {
                throw new Error("User not found");
            }
            return {
                data: {
                    user: {
                        email: user.email,
                        role: user.role,
                        id: user.id,
                        username: user.username,
                        createdAt: user.createdAt,
                        state: user.state,
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    },
}