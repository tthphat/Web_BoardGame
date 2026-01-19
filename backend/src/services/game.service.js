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

        // Logic to grant "First Play" achievement
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

        // Return processed data (or null if nothing special happened)
        return {
            gameSlug,
            earnedAchievement
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

