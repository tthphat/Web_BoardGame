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
     */
    async getLeaderboard(gameId, slug, limit = 10) {
        try {
            let query = knex("user_game_stats")
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
                    "user_game_stats.best_time_seconds as bestTimeSeconds"
                );

            // Custom sorting logic based on requirement
            if (["tic-tac-toe", "caro-4", "caro-5"].includes(slug)) {
                // Tic Tac Toe, Caro 4, Caro 5: Sort by total_score
                query = query.orderBy("user_game_stats.total_score", "desc");
            } else if (["snake", "match-3"].includes(slug)) {
                // Snake and Match 3: Sort by best_score
                query = query.orderBy("user_game_stats.best_score", "desc");
            } else if (slug === "memory-card") {
                // Memory: Sort by best_score (desc), then best_time_seconds (asc - lower is better)
                query = query.orderBy("user_game_stats.best_score", "desc")
                    .orderBy("user_game_stats.best_time_seconds", "asc");
            } else {
                // Default sorting
                query = query.orderBy("user_game_stats.best_score", "desc");
            }

            const leaderboard = await query.limit(limit);

            // Add rank to each entry
            const rankedLeaderboard = leaderboard.map((entry, index) => ({
                rank: index + 1,
                ...entry
            }));

            return { data: rankedLeaderboard, error: null };
        } catch (error) {
            console.error("UserGameStatsModel.getLeaderboard error:", error);
            return { data: null, error };
        }
    },
    /**
     * Get leaderboards for ALL enabled games
     * @param {number} limit 
     */
    async getAllLeaderboards(limit = 10) {
        try {
            // Get all enabled games
            const games = await knex("games").where("enabled", true);
            const leaderboards = {};

            // Fetch leaderboard for each game
            for (const game of games) {
                const { data } = await this.getLeaderboard(game.id, game.slug, limit);
                leaderboards[game.slug] = {
                    gameName: game.name,
                    slug: game.slug,
                    players: data
                };
            }

            return { data: leaderboards, error: null };
        } catch (error) {
            console.error("UserGameStatsModel.getAllLeaderboards error:", error);
            return { data: null, error };
        }
    }
};
