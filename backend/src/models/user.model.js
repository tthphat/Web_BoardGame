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
                // Removed .andWhere("state", "active") to include blocked users
                .count("id");

            return { data: count[0].count, error: null };
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

}

