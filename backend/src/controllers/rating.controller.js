import { RatingService } from "../services/rating.service.js";
import knex from "../../db/db.js";

export const RatingController = {
    async addRating(req, res) {
        try {
            const { gameSlug, rating, comment } = req.body;
            const userId = req.user.id;

            if (!gameSlug) {
                return res.status(400).json({ success: false, message: "Game Slug is required" });
            }

            const game = await knex("games").where({ slug: gameSlug }).first();
            if (!game) {
                return res.status(404).json({ success: false, message: "Game not found" });
            }

            const result = await RatingService.addRating({ userId, gameId: game.id, rating, comment });

            if (result.error) {
                return res.status(400).json({ success: false, message: result.error });
            }

            return res.status(201).json({ success: true, data: result.data });
        } catch (error) {
            console.error("RatingController.addRating error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },

    async getGameRatings(req, res) {
        try {
            const { slug } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const game = await knex("games").where({ slug }).first();
            if (!game) {
                return res.status(404).json({ success: false, message: "Game not found" });
            }

            const userId = req.user ? req.user.id : null;
            const result = await RatingService.getGameRatings(game.id, page, limit, userId);

            if (result.error) {
                return res.status(400).json({ success: false, message: result.error });
            }

            return res.json({ success: true, ...result.data });
        } catch (error) {
            console.error("RatingController.getGameRatings error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
};
