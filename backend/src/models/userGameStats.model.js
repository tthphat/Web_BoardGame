import knex from "../../db/db.js";

export const UserGameStatsModel = {
    /**
     * UPSERT user game stats - create or update stats for a user/game combo
     * @param {number} userId 
     * @param {number} gameId 
     * @param {object} stats - { score, won, timeSeconds, name }
     */
    async upsertStats(userId, gameId, stats) {
        try {
            const { score = 0, won = false, timeSeconds = null, name = null } = stats;

            // Check if record exists
            const existing = await knex("user_game_stats")
                .where({ user_id: userId, game_id: gameId })
                .first();

            if (existing) {
                // Update existing record
                const newTotalWins = won ? existing.total_wins + 1 : existing.total_wins;
                const updates = {
                    total_plays: existing.total_plays + 1,
                    total_wins: newTotalWins,
                    total_score: existing.total_score + score, // Cộng dồn total_score
                    updated_at: new Date()
                };

                // Update name if provided
                if (name) {
                    updates.name = name;
                }

                // Update best_score: 
                // - Nếu won = true: best_score = total_wins (cho Caro, TicTacToe)
                // - Nếu score cao hơn: best_score = score (cho Snake, Match3)
                if (won) {
                    updates.best_score = newTotalWins;
                } else if (score > existing.best_score) {
                    updates.best_score = score;
                }

                // Update best_time_seconds if new time is better (lower is better)
                if (timeSeconds !== null) {
                    if (existing.best_time_seconds === null || timeSeconds < existing.best_time_seconds) {
                        updates.best_time_seconds = timeSeconds;
                    }
                }

                const [updated] = await knex("user_game_stats")
                    .where({ user_id: userId, game_id: gameId })
                    .update(updates)
                    .returning("*");

                return {
                    data: {
                        ...updated,
                        newBestScore: score > existing.best_score,
                        newBestTime: timeSeconds !== null && (existing.best_time_seconds === null || timeSeconds < existing.best_time_seconds)
                    },
                    error: null
                };
            } else {
                // Insert new record
                const [inserted] = await knex("user_game_stats")
                    .insert({
                        user_id: userId,
                        game_id: gameId,
                        best_score: score,
                        total_score: score, // Lần đầu total_score = score
                        total_plays: 1,
                        total_wins: won ? 1 : 0,
                        best_time_seconds: timeSeconds,
                        name: name,
                        created_at: new Date(),
                        updated_at: new Date()
                    })
                    .returning("*");

                return {
                    data: {
                        ...inserted,
                        newBestScore: true,
                        newBestTime: timeSeconds !== null
                    },
                    error: null
                };
            }
        } catch (error) {
            console.error("UserGameStatsModel.upsertStats error:", error);
            return { data: null, error };
        }
    },

    /**
     * Get stats for a specific user and game
     */
    async getByUserAndGame(userId, gameId) {
        try {
            const stats = await knex("user_game_stats")
                .where({ user_id: userId, game_id: gameId })
                .first();
            return { data: stats || null, error: null };
        } catch (error) {
            console.error("UserGameStatsModel.getByUserAndGame error:", error);
            return { data: null, error };
        }
    },

    /**
     * Get all game stats for a user
     */
    async getAllByUser(userId) {
        try {
            const stats = await knex("user_game_stats")
                .join("games", "user_game_stats.game_id", "games.id")
                .where({ "user_game_stats.user_id": userId })
                .select(
                    "user_game_stats.*",
                    "games.name as game_name",
                    "games.slug as game_slug"
                )
                .orderBy("games.id", "asc");
            return { data: stats, error: null };
        } catch (error) {
            console.error("UserGameStatsModel.getAllByUser error:", error);
            return { data: null, error };
        }
    },

    /**
     * Get leaderboard for a specific game with custom sorting logic
     * @param {number} gameId 
     * @param {string} slug - Game slug to determine sorting logic
     * @param {number} limit 
     * @param {Array} allowedUserIds - Optional list of user IDs to filter by
     */
    async getLeaderboard(gameId, slug, limit = 10, offset = 0, allowedUserIds = null) {
        try {
            // Determine sorting logic based on game slug
            let orderByClause = "user_game_stats.best_score DESC"; // Default
            if (["tic-tac-toe", "caro-4", "caro-5"].includes(slug)) {
                orderByClause = "user_game_stats.total_score DESC";
            } else if (["snake", "match-3"].includes(slug)) {
                orderByClause = "user_game_stats.best_score DESC";
            } else if (slug === "memory-card") {
                orderByClause = "user_game_stats.best_score DESC, user_game_stats.best_time_seconds ASC";
            }

            // Create CTE for ranking
            // Note: Postgres uses double quotes for identifiers, but let's stick to knex raw carefully.
            // We use DENSE_RANK to handle ties properly.
            const rankedQuery = knex("user_game_stats")
                .join("users", "user_game_stats.user_id", "users.id")
                .join("games", "user_game_stats.game_id", "games.id")
                .where({ "user_game_stats.game_id": gameId })
                .select(
                    "users.id as userId",
                    "users.username",
                    "games.name as gameName",
                    "user_game_stats.best_score as bestScore",
                    "user_game_stats.total_plays as totalPlays",
                    "user_game_stats.total_wins as totalWins",
                    "user_game_stats.total_score as totalScore",
                    "user_game_stats.best_time_seconds as bestTimeSeconds",
                    knex.raw(`DENSE_RANK() OVER (ORDER BY ${orderByClause}) as "globalRank"`)
                );

            // Main query selecting from the CTE/Subquery
            let query = knex.from(rankedQuery.as("ranked"));

            // Filter by specific users if provided (applied AFTER ranking)
            if (allowedUserIds && Array.isArray(allowedUserIds) && allowedUserIds.length > 0) {
                query = query.whereIn("userId", allowedUserIds);
            }

            // Sort by rank for consistency in output
            query = query.orderBy("globalRank", "asc");

            // Count total records matching filters
            const totalQuery = query.clone().clear('order').count("* as total");
            const totalResult = await totalQuery.first();
            const total = totalResult ? parseInt(totalResult.total) : 0;

            // Apply pagination to data query
            query = query.offset(offset).limit(limit);

            const leaderboard = await query;

            // Add relative rank (index based on offset) for friends view compatibility
            // We specifically return globalRank for the frontend to use if needed
            const finalLeaderboard = leaderboard.map((entry, index) => ({
                ...entry,
                rank: offset + index + 1 // Keep relative rank as 'rank' for default view
            }));

            return {
                data: {
                    items: finalLeaderboard,
                    total: total
                },
                error: null
            };
        } catch (error) {
            console.error("UserGameStatsModel.getLeaderboard error:", error);
            return { data: null, error };
        }
    },
    /**
     * Get leaderboards for ALL enabled games
     * @param {number} limit 
     * @param {Array} allowedUserIds - Optional list of user IDs to filter by
     */
    async getAllLeaderboards(limit = 10, allowedUserIds = null) {
        try {
            // Get all enabled games except free-draw
            const games = await knex("games")
                .where("enabled", true)
                .whereNot("slug", "free-draw");
            const leaderboards = {};

            // Fetch leaderboard for each game
            for (const game of games) {
                const { data } = await this.getLeaderboard(game.id, game.slug, limit, 0, allowedUserIds); // offset 0 for summary
                if (data) {
                    leaderboards[game.slug] = {
                        gameName: game.name,
                        slug: game.slug,
                        players: data.items // Access items from new structure
                    };
                }
            }

            return { data: leaderboards, error: null };
        } catch (error) {
            console.error("UserGameStatsModel.getAllLeaderboards error:", error);
            return { data: null, error };
        }
    },
    /**
     * Get recent updates (recently played games)
     * @param {number} limit
     */
    async getRecentUpdates(limit = 10) {
        try {
            const recentUpdates = await knex("user_game_stats as ugs")
                .join("users as u", "ugs.user_id", "u.id")
                .join("games as g", "ugs.game_id", "g.id")
                .select(
                    "ugs.updated_at",
                    "ugs.best_score",
                    "ugs.total_plays",
                    "ugs.total_wins",
                    "u.username",
                    "g.name as game_name"
                )
                .orderBy("ugs.updated_at", "desc")
                .limit(limit);

            return { data: recentUpdates, error: null };
        } catch (error) {
            console.error("UserGameStatsModel.getRecentUpdates error:", error);
            return { data: null, error };
        }
    }
};
