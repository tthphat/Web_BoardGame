import knex from "../../db/db.js";
import { GameModel } from "../models/game.model.js";
import { BoardConfigModel } from "../models/boardConfig.model.js";

import { UserGameStatsModel } from "../models/userGameStats.model.js";

export const AdminService = {

    // =============
    // Get Detailed Statistics
    // =============
    async getStatistics(period = '30d') {
        try {
            // Determine date range
            const endDate = new Date();
            const startDate = new Date();

            if (period === '7d') startDate.setDate(endDate.getDate() - 7);
            else if (period === '30d') startDate.setDate(endDate.getDate() - 30);
            else if (period === '90d') startDate.setDate(endDate.getDate() - 90);
            else startDate.setDate(endDate.getDate() - 30); // Default 30d

            // 1. Game Popularity (Pie Chart) - Play count % per game
            // Using user_game_stats.total_plays as requested. 
            // Note: This reflects "All Time" popularity or accumulated plays, date filter is removed for this specific specific metric to avoid misinterpretation of cumulative data.
            const gamePopularity = await knex("user_game_stats as ugs")
                .join("games as g", "ugs.game_id", "g.id")
                .select("g.name")
                .sum("ugs.total_plays as value")
                .groupBy("g.name");

            // Calculate total plays just for logging/meta if needed, but return raw values
            const gamePopularityWithValues = gamePopularity.map(item => ({
                name: item.name,
                value: parseInt(item.value || 0)
            }));

            // 2. Play Count Trends (Line Chart)
            const playTrendsQuery = await knex("game_sessions")
                .where("created_at", ">=", startDate)
                .select(knex.raw("DATE(created_at) as date"))
                .count("id as count")
                .groupByRaw("DATE(created_at)")
                .orderBy("date", "asc");

            // Fill in missing dates
            const playTrends = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const found = playTrendsQuery.find(item => {
                    // Handle different date formats returned by drivers (Date object or string)
                    const itemDate = item.date instanceof Date ? item.date.toISOString().split('T')[0] : item.date;
                    return itemDate === dateStr;
                });
                playTrends.push({
                    date: dateStr,
                    count: found ? parseInt(found.count) : 0
                });
            }

            // 3. User Growth (Area Chart) - New vs Total
            // Get daily new users
            const newUsersQuery = await knex("users")
                .where("role", "!=", "admin")
                .andWhere("created_at", ">=", startDate)
                .select(knex.raw("DATE(created_at) as date"))
                .count("id as count")
                .groupByRaw("DATE(created_at)")
                .orderBy("date", "asc");

            // Get total users count before start date
            const initialTotalUsersResult = await knex("users")
                .where("role", "!=", "admin")
                .andWhere("created_at", "<", startDate)
                .count("id as count")
                .first();
            let runningTotal = parseInt(initialTotalUsersResult.count);

            const userGrowth = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const found = newUsersQuery.find(item => {
                    const itemDate = item.date instanceof Date ? item.date.toISOString().split('T')[0] : item.date;
                    return itemDate === dateStr;
                });

                const newCount = found ? parseInt(found.count) : 0;
                runningTotal += newCount;

                userGrowth.push({
                    date: dateStr,
                    newUsers: newCount,
                    totalUsers: runningTotal
                });
            }

            // 4. Global Leaderboard (Top 10 High Scores All Games)
            // Strategy: Get top score for each user per game, then top 10 overall
            // Note: Scored differently per game. This is a "Hall of Fame" mixed table.

            const globalLeaderboard = await knex("user_game_stats as ugs")
                .join("users as u", "ugs.user_id", "u.id")
                .join("games as g", "ugs.game_id", "g.id")
                .select(
                    "u.username",
                    "g.name as gameName",
                    "ugs.best_score as score",
                    "ugs.created_at as date"
                )
                .orderBy("ugs.best_score", "desc")
                .limit(10);

            return {
                data: {
                    gamePopularity: gamePopularityWithValues,
                    playTrends,
                    userGrowth,
                    globalLeaderboard
                }
            };

        } catch (error) {
            console.error("AdminService.getStatistics error:", error);
            throw error;
        }
    },

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

            // 3. Total Matches (Global) - Sum of total_plays from user_game_stats
            const totalMatchesResult = await knex("user_game_stats")
                .sum("total_plays as count")
                .first();
            const totalMatches = parseInt(totalMatchesResult.count || 0);

            // 4. Matches by Game (for Dropdown) - Sum of total_plays from user_game_stats
            const matchesByGame = await knex("user_game_stats as ugs")
                .join("games as g", "ugs.game_id", "g.id")
                .select("g.id", "g.name")
                .sum("ugs.total_plays as count")
                .groupBy("g.id", "g.name");

            // Format matches by game
            const matchesStats = matchesByGame.map(item => ({
                gameId: item.id,
                gameName: item.name,
                count: parseInt(item.count || 0)
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
            // 1. Recent Game Sessions (Last 10) - Now using User Game Stats
            const { data: recentSessions } = await UserGameStatsModel.getRecentUpdates(10);

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

    },
    // ... (previous code)

    // =============
    // Game Management
    // =============
    async getAllGames() {
        try {
            const { data, error } = await GameModel.findAll();
            if (error) throw error;
            return { data };
        } catch (error) {
            throw error;
        }
    },

    async updateGameState(id, enabled) {
        try {
            const { data, error } = await GameModel.updateState(id, enabled);
            if (error) throw error;
            return { data };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Board Config Management
    // =============
    async getAllBoardConfigs() {
        try {
            const { data, error } = await BoardConfigModel.findAll();
            if (error) throw error;
            return { data };
        } catch (error) {
            throw error;
        }
    },

    async updateBoardConfig(id, configData) {
        try {
            const { data, error } = await BoardConfigModel.update(id, configData);
            if (error) throw error;
            return { data };
        } catch (error) {
            throw error;
        }
    },

    async activateBoardConfig(id) {
        try {
            const { data, error } = await BoardConfigModel.activate(id);
            if (error) throw error;
            return { data };
        } catch (error) {
            throw error;
        }
    }
};
