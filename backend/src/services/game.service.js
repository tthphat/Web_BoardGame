import { AchievementService } from "./achievement.service.js";
import { BoardConfigModel } from "../models/boardConfig.model.js";
import { GameModel } from "../models/game.model.js";

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

        // 1. Get Game ID
        const game = await knex("games").where("slug", gameSlug).first();
        if (!game) {
            throw new Error(`Game not found: ${gameSlug}`);
        }

        // 2. Update User Game Stats
        const existingStats = await knex("user_game_stats")
            .where({ user_id: userId, game_id: game.id })
            .first();

        // Calculate scoreToAdd based on game type
        // For win/loss games (caro, tictactoe), score is usually just 1 for win
        const WIN_LOSS_GAMES = ["tic-tac-toe", "caro-4", "caro-5"];
        let scoreToAdd = 0;

        if (WIN_LOSS_GAMES.includes(gameSlug)) {
            if (result.status === "win") scoreToAdd = 1;
        } else {
            // For score-based games (snake, match-3, etc.), use the raw score
            scoreToAdd = parseInt(result.score) || 0;
        }

        const isWin = result.status === "win";
        const isLose = result.status === "lose";
        const currentScore = scoreToAdd; // Score of THIS game session to compare with best_score

        if (existingStats) {
            await knex("user_game_stats")
                .where({ id: existingStats.id })
                .update({
                    total_plays: knex.raw("total_plays + 1"),
                    total_wins: isWin ? knex.raw("total_wins + 1") : existingStats.total_wins,
                    total_losses: isLose ? knex.raw("total_losses + 1") : existingStats.total_losses,
                    total_score: knex.raw(`total_score + ${scoreToAdd}`),
                    best_score: Math.max(existingStats.best_score || 0, currentScore),
                    updated_at: new Date()
                });
        } else {
            await knex("user_game_stats").insert({
                user_id: userId,
                game_id: game.id,
                total_plays: 1,
                total_wins: isWin ? 1 : 0,
                total_losses: isLose ? 1 : 0,
                total_score: scoreToAdd,
                best_score: currentScore,
                created_at: new Date(),
                updated_at: new Date()
            });
        }

        // 3. Achievement Logic (Existing)
        const achievementCode = GAME_ACHIEVEMENT_MAPPING[gameSlug];
        let earnedAchievement = null;

        if (achievementCode) {
            earnedAchievement = await AchievementService.grantAchievement(knex, userId, achievementCode, {
                gameSlug,
                result,
                date: new Date()
            });

            if (earnedAchievement) {
                console.log(`Achievement Granted: ${earnedAchievement.name}`);
            }
        }

        return {
            gameSlug,
            earnedAchievement,
            statsUpdated: true
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

