import { GameService } from "../services/game.service.js";
import knex from "../../db/db.js";

export const GameController = {
    async finishGame(req, res, next) {
        try {
            const userId = req.user.id;
            const { gameSlug, result } = req.body;

            if (!gameSlug) {
                throw new Error("Game Slug is required");
            }

            const data = await GameService.finishGame(knex, userId, gameSlug, result);

            res.json({
                success: true,
                data
            });
        } catch (error) {
            next(error);
        }
    }
};
