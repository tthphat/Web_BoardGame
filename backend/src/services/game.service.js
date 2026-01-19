import { AchievementService } from "./achievement.service.js";
import { BoardConfigModel } from "../models/boardConfig.model.js";
import { GameModel } from "../models/game.model.js";
import { UserGameStatsModel } from "../models/userGameStats.model.js";

const GAME_ACHIEVEMENT_MAPPING = {
    "tic-tac-toe": "FIRST_PLAY_TIC_TAC_TOE",
    "caro-4": "FIRST_PLAY_CARO_4",
    "caro-5": "FIRST_PLAY_CARO_5",
    "match-3": "FIRST_PLAY_MATCH_3",
    "snake": "FIRST_PLAY_SNAKE",
    "memory-card": "FIRST_PLAY_MEMORY_CARD",
    "free-draw": "FIRST_PLAY_FREE_DRAW"
};

export class GameService {
    static async finishGame(knex, userId, gameSlug, result) {
        console.log(`Game Finished: User ${userId} played ${gameSlug}. Result:`, result);

        // Logic to grant "First Play" achievement
        const achievementCode = GAME_ACHIEVEMENT_MAPPING[gameSlug];
        let earnedAchievement = null;

        if (achievementCode) {
            earnedAchievement = await AchievementService.grantAchievementService(knex, userId, achievementCode, {
                gameSlug,
                result,
                date: new Date()
            });

            if (earnedAchievement) {
                console.log(`Achievement Granted: ${earnedAchievement.name}`);
            }
        }

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

        // Return processed data
        return {
            gameSlug,
            earnedAchievement,
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

