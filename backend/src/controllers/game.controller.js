import { GameService } from "../services/game.service.js";
import { UserGameStatsModel } from "../models/userGameStats.model.js";
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
    },

    // Get leaderboard for a specific game (public)
    async getLeaderboard(req, res, next) {
        try {
            const { slug } = req.params;
            const limit = parseInt(req.query.limit) || 10;

            // Get game by slug
            const game = await knex("games").where({ slug }).first();
            if (!game) {
                return res.status(404).json({
                    success: false,
                    error: "Game not found"
                });
            }

            const { data, error } = await UserGameStatsModel.getLeaderboard(game.id, limit);
            if (error) throw error;

            res.json({
                success: true,
                data
            });
        } catch (error) {
            next(error);
        }
    },

    // Get all game stats for current user
    async getUserStats(req, res, next) {
        try {
            const userId = req.user.id;
            const { data, error } = await UserGameStatsModel.getAllByUser(userId);
            if (error) throw error;

            res.json({
                success: true,
                data
            });
        } catch (error) {
            next(error);
        }
    },

    // Get stats for a specific game for current user
    async getGameStats(req, res, next) {
        try {
            const userId = req.user.id;
            const { slug } = req.params;

            // Get game by slug
            const game = await knex("games").where({ slug }).first();
            if (!game) {
                return res.status(404).json({
                    success: false,
                    error: "Game not found"
                });
            }

            const { data, error } = await UserGameStatsModel.getByUserAndGame(userId, game.id);
            if (error) throw error;

            res.json({
                success: true,
                data: data || {
                    total_wins: 0,
                    total_plays: 0,
                    best_score: 0,
                    total_score: 0,
                    best_time_seconds: null
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

