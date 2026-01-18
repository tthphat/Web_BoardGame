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

    // =============
    // Get All Users
    // =============
    async getAllUsers(page, limit, search) {
        try {
            const offset = (page - 1) * limit;

            const { data: count, error: countError } = await UserModel.countUsers(search);
            if (countError) {
                throw new Error("Failed to count users");
            }

            const { data: users, error } = await UserModel.getAllUsers(offset, limit, search);
            if (error) {
                throw new Error("Failed to get all users");
            }

            return {
                data: {
                    users,
                    pagination: {
                        page,
                        limit,
                        totalPages: Math.ceil(count / limit),
                        total: count
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Get All Users Friend
    // =============
    async getAllUsersFriend(currentUserId, page, limit, search) {
        try {
            const offset = (page - 1) * limit;

            const { data: count, error: countError } = await UserModel.countUsersFriend(currentUserId, search);
            if (countError) {
                throw new Error("Failed to count users");
            }

            const { data: users, error } = await UserModel.getAllUsersFriend(currentUserId, offset, limit, search);
            if (error) {
                throw new Error("Failed to get all users");
            }

            return {
                data: {
                    users,
                    pagination: {
                        page,
                        limit,
                        totalPages: Math.ceil(count / limit),
                        total: count
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Update User State (Block/Unblock)
    // =============
    async updateUserState(userId, state) {
        try {
            const { data, error } = await UserModel.updateUser(userId, { state });
            if (error) throw error;
            return { data };
        } catch (error) {
            throw error;
        }
    },
    // Get Friend Requests
    // =============
    async getFriendRequests(id, page, limit, search) {
        try {
            const offset = (page - 1) * limit;

            const { data: count, error: countError } = await UserModel.countFriendRequests(id, search);
            if (countError) {
                throw new Error("Failed to count friend requests");
            }

            const { data: friendRequests, error } = await UserModel.getFriendRequests(id, offset, limit, search);
            console.log("Backend-user.service.js-getFriendRequests: ", friendRequests);
            if (error) {
                throw new Error("Failed to get friend requests");
            }

            return {
                data: {
                    friendRequests,
                    pagination: {
                        page,
                        limit,
                        totalPages: Math.ceil(count / limit),
                        total: count
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Get My Friends
    // =============
    async getMyFriends(id, page, limit, search) {
        try {
            const offset = (page - 1) * limit;

            const { data: count, error: countError } = await UserModel.countMyFriends(id, search);
            if (countError) {
                throw new Error("Failed to count my friends");
            }

            const { data: myFriends, error } = await UserModel.getMyFriends(id, offset, limit, search);
            console.log("Backend-user.service.js-getMyFriends: ", myFriends);
            if (error) {
                throw new Error("Failed to get my friends");
            }

            return {
                data: {
                    myFriends,
                    pagination: {
                        page,
                        limit,
                        totalPages: Math.ceil(count / limit),
                        total: count
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Add Friend
    // =============
    async addFriend(id, user_id) {
        try {
            const { data: friend, error } = await UserModel.addFriend(id, user_id);
            if (error || !friend) {
                throw new Error("Failed to add friend");
            }
            console.log("Backend-user.service.js-addFriend: ", friend);
            return {
                data: {
                    friend
                }
            };
        } catch (error) {
            throw error;
        }
    },
};