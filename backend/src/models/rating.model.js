import knex from "../../db/db.js";

export const RatingModel = {
    // Add a new rating
    async create(ratingData) {
        try {
            const [rating] = await knex("ratings")
                .insert(ratingData)
                .returning("*");
            return { data: rating, error: null };
        } catch (error) {
            console.error("RatingModel.create error:", error);
            // Check for unique constraint violation
            if (error.code === '23505') {
                return { data: null, error: "You have already rated this game." };
            }
            return { data: null, error: error.message };
        }
    },

    // Get all ratings for a specific game
    async findByGameId(gameId, limit = 10, offset = 0) {
        try {
            const ratings = await knex("ratings")
                .join("users", "ratings.user_id", "users.id")
                .select(
                    "ratings.*",
                    "users.username"
                )
                .where({ "ratings.game_id": gameId })
                .orderBy("ratings.created_at", "desc")
                .limit(limit)
                .offset(offset);

            return { data: ratings, error: null };
        } catch (error) {
            console.error("RatingModel.findByGameId error:", error);
            return { data: null, error: error.message };
        }
    },

    // Get average rating and count for a game
    async getStatsByGameId(gameId) {
        try {
            const result = await knex("ratings")
                .where({ game_id: gameId })
                .first()
                .count("id as count")
                .avg("rating as average");

            return {
                data: {
                    count: parseInt(result.count),
                    average: parseFloat(result.average) || 0
                },
                error: null
            };
        } catch (error) {
            console.error("RatingModel.getStatsByGameId error:", error);
            return { data: null, error: error.message };
        }
    },

    // Check if user has rated a game
    async findByUserAndGame(userId, gameId) {
        try {
            const rating = await knex("ratings")
                .where({ user_id: userId, game_id: gameId })
                .first();
            return { data: rating, error: null };
        } catch (error) {
            console.error("RatingModel.findByUserAndGame error:", error);
            return { data: null, error: error.message };
        }
    }
};
