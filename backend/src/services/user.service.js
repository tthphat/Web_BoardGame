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
    async addFriend(sender_id, receiver_id) {
        try {
            // không gửi cho chính mình
            if (sender_id === receiver_id) {
                throw new Error("Cannot send friend request to yourself");
            }

            const { data: existed } = await UserModel.checkExistedFriendRequest(sender_id, receiver_id);
            if (existed) {
                throw new Error("Friend request already exists");
            }

            const { error } = await UserModel.addFriend(sender_id, receiver_id);
            if (error) {
                throw new Error("Failed to add friend");
            }

            return {
                data: {
                    message: "Add friend successfully"
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Accept Friend
    // =============
    async acceptFriend(receiver_id, sender_id) {
        try {
            const { error } = await UserModel.acceptFriend(receiver_id, sender_id);
            if (error) {
                throw new Error("Failed to accept friend");
            }
            return {
                data: {
                    message: "Accept friend successfully"
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Reject Friend
    // =============
    async rejectFriend(receiver_id, sender_id) {
        try {
            const { error } = await UserModel.rejectFriend(receiver_id, sender_id);
            if (error) {
                throw new Error("Failed to reject friend");
            }
            return {
                data: {
                    message: "Reject friend successfully"
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Remove Friend
    // =============
    async removeFriend(current_id, friend_id) {
        try {
            const conversation_id = await UserModel.checkExistConversation(current_id, friend_id);
            if (conversation_id) {
                const { error: removeConversationError } = await UserModel.deleteConversation(conversation_id);
                if (removeConversationError) {
                    throw new Error("Failed to remove conversation");
                }
            }

            const { error } = await UserModel.removeFriend(current_id, friend_id);
            if (error) {
                throw new Error("Failed to remove friend");
            }

            return {
                data: {
                    message: "Remove friend successfully"
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Get All My Conversations
    // =============
    async getAllMyConversations(current_id, page, limit, search) {
        try {
            const offset = (page - 1) * limit;

            const { data: count, error: countError } = await UserModel.countConversations(current_id, search);
            if (countError) {
                throw new Error("Failed to count conversations");
            }

            const { data: conversations, error } = await UserModel.getAllMyConversations(current_id, offset, limit, search);
            if (error) {
                throw new Error("Failed to get all my conversations");
            }

            return {
                data: {
                    conversations,
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
    // Get Messages
    // =============
    async getMessages(conversation_id, offset, limit, current_id) {
        try {
            const { data: messages, error } = await UserModel.getMessages(conversation_id, offset, limit, current_id);
            if (error) {
                throw new Error("Failed to get messages");
            }

            const { data: partner, error: partnerError } = await UserModel.getPartner(conversation_id, current_id);
            if (partnerError) {
                throw new Error("Failed to get partner");
            }

            return {
                data: {
                    messages: messages.reverse(),
                    partner
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Send Message
    // =============
    async sendMessage(conversation_id, content, current_id) {
        try {
            const { data: message, error } = await UserModel.sendMessage(conversation_id, content, current_id);
            console.log("Backend-user.service.js-sendMessage: ", error);
            if (error) {
                throw new Error("Failed to send message");
            }
            return {
                data: {
                    message
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Search Users
    // =============
    async searchUsers(search, current_id) {
        try {
            const { data: users, error } = await UserModel.searchUsers(search, current_id);
            if (error) {
                throw new Error("Failed to search users");
            }
            return {
                data: {
                    users
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Get User
    // =============
    async getUser(id) {
        try {
            const { data: user, error } = await UserModel.getUser(id);
            if (error) {
                throw new Error("Failed to get user");
            }
            return {
                data: {
                    user
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // create new conversation
    async createNewConversation(friend_id, content, current_id) {
        try {
            const { data: existConversation, error: existError } = await UserModel.checkExistConversation(friend_id, current_id);
            if (existError) {
                throw new Error("Failed to check exist conversation");
            }

            if (existConversation) {
                return {
                    data: {
                        conversation_id: existConversation.id
                    }
                };
            }

            const { data: conversation, error } = await UserModel.createNewConversation(friend_id, current_id);
            if (error) {
                throw new Error("Failed to create new conversation");
            }

            await UserModel.sendMessage(conversation.id, content, current_id);

            return {
                data: {
                    conversation_id: conversation.id
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // check exist conversation
    async checkExistConversation(friend_id, current_id) {
        try {
            const { data: conversation, error } = await UserModel.checkExistConversation(friend_id, current_id);
            if (error) {
                throw new Error("Failed to check exist conversation");
            }
            return {
                data: {
                    conversation
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // delete conversation
    async deleteConversation(id) {
        try {
            const { data, error } = await UserModel.deleteConversation(id);
            if (error) {
                throw new Error("Failed to delete conversation");
            }
            return {
                data: {
                    message: "Delete conversation successfully",
                    data
                }
            };
        } catch (error) {
            throw error;
        }
    },
};