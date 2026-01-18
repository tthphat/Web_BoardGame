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

    // Find all users with pagination and achievement stats
    async findAllUsers(limit, offset) {
        try {
            const users = await knex("users")
                .select(
                    "users.id",
                    "users.username",
                    "users.email",
                    "users.role",
                    "users.state",
                    "users.created_at"
                )
                .count("user_achievements.id as achievement_count")
                .leftJoin("user_achievements", "users.id", "user_achievements.user_id")
                .groupBy("users.id")
                .orderBy("users.created_at", "desc")
                .limit(limit)
                .offset(offset);

            const totalResult = await knex("users").count("id as count").first();
            const total = totalResult.count;

            return { data: { users, total }, error: null };
        } catch (error) {
            console.error("Error in findAllUsers:", error);
            return { data: null, error };
        }
    }

}

