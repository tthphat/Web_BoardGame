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
            console.log("Backend-user.service.js-getProfile: ", user);
            return {
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        username: user.username,
                        created_at: user.created_at,
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Edit Profile
    // =============
    async editProfile(id, editData) {
        try {
            const { data: user, error } = await UserModel.findUserById(id);
            if (error || !user) {
                throw new Error("User not found");
            }

            const dataToEdit = { ...editData };

            // Kiểm tra nếu update password thì phải hash
            if (dataToEdit.password) {
                // Kiểm tra mật khẩu cũ
                if (!dataToEdit.oldPassword) {
                    throw new Error("Old password is required");
                }

                const isMatch = await bcrypt.compare(dataToEdit.oldPassword, user.password);
                if (!isMatch) {
                    throw new Error("Old password is incorrect");
                }

                dataToEdit.password = await bcrypt.hash(dataToEdit.password, 10);
                delete dataToEdit.oldPassword;
            }

            const { data: editedUser, error: editError } = await UserModel.updateUser(id, dataToEdit);

            if (editError) {
                throw new Error("Failed to edit profile");
            }

            return {
                data: {
                    user: editedUser
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Get Me
    // =============
    async getMe(id) {
        try {
            const { data: user, error } = await UserModel.findUserById(id);
            if (error || !user) {
                throw new Error("User not found");
            }
            console.log("Backend-user.service.js-getMe: ", user);
            return {
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    },
};