import { GameService } from "../services/game.service.js";
import knex from "../../db/db.js";

export const GameController = {
    // Get enabled games (public)
    async getEnabledGames(req, res, next) {
        try {
            const games = await GameService.getEnabledGames();
            res.json({
                success: true,
                data: games
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all games (admin only)
    async getAllGames(req, res, next) {
        try {
            const games = await GameService.getAllGames();
            res.json({
                success: true,
                data: games
            });
        } catch (error) {
            next(error);
        }
    },

    // Toggle game enabled status (admin only)
    async toggleGameEnabled(req, res, next) {
        try {
            const { gameId, enabled } = req.body;
            
            if (gameId === undefined || enabled === undefined) {
                return res.status(400).json({
                    success: false,
                    error: "gameId and enabled are required"
                });
            }

            const game = await GameService.toggleGameEnabled(gameId, enabled);
            res.json({
                success: true,
                data: game,
                message: `Game ${enabled ? 'enabled' : 'disabled'} successfully`
            });
        } catch (error) {
            next(error);
        }
    },

    // Finish game (existing)
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
    },

    async getBoardConfigs(req, res, next) {
        try {
            const result = await GameService.getBoardConfigs();
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};

