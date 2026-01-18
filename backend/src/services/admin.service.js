import knex from "../db/db.js";

export const AdminService = {
    // =============
    // Get Dashboard Stats
    // =============
    async getDashboardStats() {
        try {
            // 1. Total Users (excluding admins)
            const totalUsersResult = await knex("users")
                .where("role", "!=", "admin")
                .count("id as count")
                .first();
            const totalUsers = parseInt(totalUsersResult.count);

            // 2. New Users Today
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const newUsersTodayResult = await knex("users")
                .where("role", "!=", "admin")
                .andWhere("created_at", ">=", today)
                .count("id as count")
                .first();
            const newUsersToday = parseInt(newUsersTodayResult.count);

            // 3. Total Matches (Global)
            const totalMatchesResult = await knex("game_sessions")
                .count("id as count")
                .first();
            const totalMatches = parseInt(totalMatchesResult.count);

            // 4. Matches by Game (for Dropdown)
            const matchesByGame = await knex("game_sessions as gs")
                .join("games as g", "gs.game_id", "g.id")
                .select("g.id", "g.name")
                .count("gs.id as count")
                .groupBy("g.id", "g.name");

            // Format matches by game
            const matchesStats = matchesByGame.map(item => ({
                gameId: item.id,
                gameName: item.name,
                count: parseInt(item.count)
            }));

            return {
                data: {
                    totalUsers,
                    newUsersToday,
                    totalMatches,
                    matchesByGame: matchesStats
                }
            };
        } catch (error) {
            console.error("AdminService.getDashboardStats error:", error);
            throw error;
        }
    },

    // =============
    // Get Recent Activities
    // =============
    async getRecentActivities() {
        try {
            // 1. Recent Game Sessions (Last 10)
            const recentSessions = await knex("game_sessions as gs")
                .join("users as u", "gs.user_id", "u.id")
                .join("games as g", "gs.game_id", "g.id")
                .select(
                    "gs.id",
                    "gs.created_at",
                    "gs.score",
                    "gs.status",
                    "u.username",
                    "g.name as game_name"
                )
                .orderBy("gs.created_at", "desc")
                .limit(10);

            // 2. New Registrations (Last 5)
            const newRegistrations = await knex("users")
                .where("role", "!=", "admin")
                .select("id", "username", "email", "created_at", "role")
                .orderBy("created_at", "desc")
                .limit(5);

            return {
                data: {
                    recentSessions,
                    newRegistrations
                }
            };
        } catch (error) {
            console.error("AdminService.getRecentActivities error:", error);
            throw error;
        }
    }
};
