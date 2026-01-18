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

    // =============
    // Get All Users
    // =============
    async getAllUsersFriend(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search || "";

            const users = await UserService.getAllUsersFriend(req.user.id, page, limit, search);
            res.json({
                data: {
                    users: users.data.users,
                    pagination: users.data.pagination
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // =============
    // Get Friend Requests
    // =============
    async getFriendRequests(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search || "";

            const friendRequests = await UserService.getFriendRequests(req.user.id, page, limit, search);
            res.json({
                data: {
                    friendRequests: friendRequests.data.friendRequests,
                    pagination: friendRequests.data.pagination
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // =============
    // Get My Friends
    // =============
    async getMyFriends(req, res, next) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search || "";

            const myFriends = await UserService.getMyFriends(req.user.id, page, limit, search);
            res.json({
                data: {
                    myFriends: myFriends.data.myFriends,
                    pagination: myFriends.data.pagination
                }
            });
        } catch (error) {
            next(error);
        }
    },

    // =============
    // Add Friend
    // =============
    async addFriend(req, res, next) {
        try {
            const { user_id } = req.body;
            const friend = await UserService.addFriend(req.user.id, user_id);
            res.json({
                data: {
                    friend: friend.data.friend
                }
            });
        } catch (error) {
            next(error);
        }
    },
}

