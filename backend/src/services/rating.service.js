import { RatingModel } from "../models/rating.model.js";
import { GameModel } from "../models/game.model.js";

export const RatingService = {
    async addRating({ userId, gameId, rating, comment }) {
        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return { data: null, error: "Rating must be between 1 and 5" };
        }

        // Check if game exists (Optional, but good practice)
        // Check if user already rated
        const existingRating = await RatingModel.findByUserAndGame(userId, gameId);
        if (existingRating.data) {
            return { data: null, error: "You have already rated this game" };
        }

        return await RatingModel.create({
            user_id: userId,
            game_id: gameId,
            rating,
            comment
        });
    },

    async getGameRatings(gameId, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        // Get ratings list
        const ratings = await RatingModel.findByGameId(gameId, limit, offset);
        if (ratings.error) return ratings;

        // Get stats (average, count)
        const stats = await RatingModel.getStatsByGameId(gameId);
        if (stats.error) return stats;

        return {
            data: {
                ratings: ratings.data,
                stats: stats.data,
                pagination: {
                    page,
                    limit,
                    total: stats.data.count
                }
            },
            error: null
        };
    }
};
