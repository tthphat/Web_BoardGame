import { AchievementCheckerService } from "./achievementChecker.service.js";
import { BoardConfigModel } from "../models/boardConfig.model.js";
import { GameModel } from "../models/game.model.js";
import { UserGameStatsModel } from "../models/userGameStats.model.js";

export class GameService {
    static async finishGame(knex, userId, gameSlug, result) {
        console.log(`Game Finished: User ${userId} played ${gameSlug}. Result:`, result);

        // Get game_id from slug for stats update
        const game = await knex("games").where({ slug: gameSlug }).first();

        // Get user info for storing name
        const user = await knex("users").where({ id: userId }).first();

        let stats = null;

        if (game && result) {
            const { data: statsData, error: statsError } = await UserGameStatsModel.upsertStats(
                userId,
                game.id,
                {
                    score: result.score || 0,
                    won: result.won || false,
                    timeSeconds: result.timeSeconds || null,
                    name: user?.username || null
                }
            );

            if (statsError) {
                console.error("Error updating user game stats:", statsError);
            } else {
                stats = {
                    newBestScore: statsData.newBestScore,
                    newBestTime: statsData.newBestTime,
                    bestScore: statsData.best_score,
                    totalPlays: statsData.total_plays,
                    totalWins: statsData.total_wins,
                    bestTimeSeconds: statsData.best_time_seconds
                };
                console.log("User game stats updated:", stats);
            }
        }

        // Build context for achievement checkers
        const achievementContext = {
            gameSlug,
            userId,
            result,
            stats
        };

        // Run all achievement checkers
        const earnedAchievements = await AchievementCheckerService.checkAndGrantAchievements(
            knex,
            achievementContext
        );

        // Return processed data
        return {
            gameSlug,
            earnedAchievements,
            stats
        };
    }

    // Get enabled games (public)
    static async getEnabledGames() {
        const { data, error } = await GameModel.getEnabledGames();
        if (error) throw error;
        return data;
    }

    // Get all games (for admin)
    static async getAllGames() {
        const { data, error } = await GameModel.findAll();
        if (error) throw error;
        return data;
    }

    // Toggle game enabled status (for admin)
    static async toggleGameEnabled(gameId, enabled) {
        const { data, error } = await GameModel.updateState(gameId, enabled);
        if (error) throw error;
        return data;
    }

    static async getBoardConfigs() {
        try {
            const { data, error } = await BoardConfigModel.findAll();
            if (error) throw error;
            return { data };
        } catch (error) {
            throw error;
        }
    }
}
