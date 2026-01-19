import knex from "../../db/db.js";

export const UserModel = {

    // Find user by email
    async findUserByEmail(email) {
        try {
            const user = await knex("users")
                .where({ email })
                .first();

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Create user
    async createUser(data) {
        try {
            const [user] = await knex("users")
                .insert(data)
                .returning(["id", "email", "username", "role"]);

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Delete user
    async deleteUser(id) {
        try {
            const user = await knex("users")
                .where({ id })
                .del();

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Update user
    async updateUser(id, data) {
        try {
            const user = await knex("users")
                .where({ id })
                .update(data);

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Find user by id
    async findUserById(id) {
        try {
            const user = await knex("users")
                .where({ id })
                .first();

            return { data: user, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get all users with pagination, search, and achievement count
    async getAllUsers(offset, limit, search) {
        try {
            const query = knex("users")
                .select(
                    "users.id",
                    "users.username",
                    "users.email",
                    "users.role",
                    "users.state",
                    "users.created_at",
                    "users.updated_at"
                )
                .count("user_achievements.id as achievement_count")
                .leftJoin("user_achievements", "users.id", "user_achievements.user_id")
                .where((qb) => {
                    qb.where("users.username", "ilike", `%${search}%`)
                        .orWhere("users.email", "ilike", `%${search}%`);
                })
                .andWhere("users.role", "!=", "admin")
                .groupBy("users.id")
                .orderBy("users.created_at", "desc")
                .limit(limit)
                .offset(offset);

            const users = await query;
            return { data: users, error: null };
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            return { data: null, error };
        }
    },

    // Count users
    async countUsers(search) {
        try {
            const count = await knex("users")
                .where((qb) => {
                    qb.where("username", "ilike", `%${search}%`)
                        .orWhere("email", "ilike", `%${search}%`);
                })
                .andWhere("role", "!=", "admin")
                .count("id");

            return { data: count[0].count, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },


    // Get all users friend
    async getAllUsersFriend(currentUserId, offset, limit, search = "") {
        try {
            const users = await knex("users as u")
                .leftJoin("friends as f", function () {
                    this.on(function () {
                        this.on("f.sender_id", "=", knex.raw("?", [currentUserId]))
                            .andOn("f.receiver_id", "=", "u.id");
                    }).orOn(function () {
                        this.on("f.receiver_id", "=", knex.raw("?", [currentUserId]))
                            .andOn("f.sender_id", "=", "u.id");
                    });
                })
                .where("u.state", "active")
                .andWhere("u.role", "!=", "admin")
                .andWhere("u.id", "!=", currentUserId)
                .andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                })
                .select(
                    "u.id",
                    "u.username",
                    "u.email",
                    "u.role",
                    "u.created_at",
                    "f.status as friend_status",
                    knex.raw(`
                CASE
                    WHEN f.status IS NULL THEN 'none'
                    WHEN f.status = 'pending' AND f.sender_id = ? THEN 'sent'
                    WHEN f.status = 'pending' AND f.receiver_id = ? THEN 'received'
                    WHEN f.status = 'accepted' THEN 'friend'
                END as friend_state
                `, [currentUserId, currentUserId])
                )
                .offset(offset)
                .limit(limit);

            return { data: users, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Count users friend
    async countUsersFriend(currentUserId, search = "") {
        try {
            const count = await knex("users as u")
                .leftJoin("friends as f", function () {
                    this.on(function () {
                        this.on("f.sender_id", "=", knex.raw("?", [currentUserId]))
                            .andOn("f.receiver_id", "=", "u.id");
                    }).orOn(function () {
                        this.on("f.receiver_id", "=", knex.raw("?", [currentUserId]))
                            .andOn("f.sender_id", "=", "u.id");
                    });
                })
                .where("u.state", "active")
                .andWhere("u.role", "!=", "admin")
                .andWhere("u.id", "!=", currentUserId)
                .andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                })
                .countDistinct("u.id as count");

            return { data: Number(count[0].count), error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get friend requests
    async getFriendRequests(userId, offset, limit, search = "") {
        try {
            const query = knex("friends as f")
                .join("users as u", "u.id", "f.sender_id") // user_id = người gửi
                .where("f.receiver_id", userId)            // user hiện tại là người nhận
                .andWhere("f.status", "pending");

            if (search) {
                query.andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                });
            }

            const friendRequests = await query
                .select(
                    "f.sender_id",
                    "f.receiver_id",
                    "f.status",
                    "f.created_at",
                    "u.username",
                    "u.email"
                )
                .orderBy("f.created_at", "desc") // sort theo mới nhất
                .offset(offset)
                .limit(limit);

            return { data: friendRequests, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Count friend requests
    async countFriendRequests(userId, search = "") {
        try {
            const query = knex("friends as f")
                .join("users as u", "u.id", "f.sender_id") // user_id = người gửi
                .where("f.receiver_id", userId)            // người nhận
                .andWhere("f.status", "pending");

            if (search) {
                query.andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                });
            }

            const count = await query.count("f.sender_id as count");

            return { data: Number(count[0].count), error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Get my friends
    async getMyFriends(userId, offset, limit, search = "") {
        try {
            const query = knex("friends as f")
                .join("users as u", function () {
                    this.on("u.id", "=", "f.sender_id")
                        .orOn("u.id", "=", "f.receiver_id");
                })
                .where("f.status", "accepted")
                .andWhere(function () {
                    this.where("f.sender_id", userId)
                        .orWhere("f.receiver_id", userId);
                })
                .andWhere("u.id", "!=", userId); // loại chính mình

            if (search) {
                query.andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                });
            }

            const myFriends = await query
                .select(
                    "u.id as friend_id",
                    "u.username",
                    "u.email",
                    "f.accepted_at"
                )
                .orderBy("f.accepted_at", "desc")
                .offset(offset)
                .limit(limit);

            return { data: myFriends, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Count my friends
    async countMyFriends(userId, search = "") {
        try {
            const query = knex("friends as f")
                .join("users as u", function () {
                    this.on("u.id", "=", "f.sender_id")
                        .orOn("u.id", "=", "f.receiver_id");
                })
                .where("f.status", "accepted")
                .andWhere(function () {
                    this.where("f.sender_id", userId)
                        .orWhere("f.receiver_id", userId);
                })
                .andWhere("u.id", "!=", userId); // loại chính mình

            if (search) {
                query.andWhere((qb) => {
                    qb.where("u.username", "ilike", `%${search}%`)
                        .orWhere("u.email", "ilike", `%${search}%`);
                });
            }

            const count = await query.count("u.id as count");

            return { data: Number(count[0].count), error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Add friend
    async addFriend(senderId, receiverId) {
        try {
            await knex("friends")
                .insert({
                    sender_id: senderId,
                    receiver_id: receiverId,
                    status: "pending"
                })

            return { error: null };
        } catch (error) {
            return { error };
        }
    },

    // Check existed friend request
    async checkExistedFriendRequest(senderId, receiverId) {
        try {
            const existed = await knex("friends")
                .where(function () {
                    this.where("sender_id", senderId)
                        .andWhere("receiver_id", receiverId);
                })
                .orWhere(function () {
                    this.where("sender_id", receiverId)
                        .andWhere("receiver_id", senderId);
                })
                .first();

            return { data: existed, error: null };
        } catch (error) {
            return { data: null, error };
        }
    },

    // Accept friend
    async acceptFriend(receiverId, senderId) {
        try {
            await knex("friends")
                .where({ receiver_id: receiverId, sender_id: senderId })
                .update({ status: "accepted", accepted_at: new Date() })

            return { error: null };
        } catch (error) {
            return { error };
        }
    },

    // Reject friend
    async rejectFriend(receiverId, senderId) {
        try {
            await knex("friends")
                .where({ receiver_id: receiverId, sender_id: senderId })
                .delete();

            return { error: null };
        } catch (error) {
            return { error };
        }
    },
}

