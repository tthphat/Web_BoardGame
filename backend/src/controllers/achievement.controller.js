import { AchievementService } from "../services/achievement.service.js";
import knex from "../../db/db.js";

export const AchievementController = {
    async getUserAchievements(req, res, next) {
        try {
            const userId = req.user.id;
            const { gameSlug, search } = req.query;

            const achievements = await AchievementService.getUserAchievementsService(knex, userId, gameSlug, search);

            res.json({
                data: achievements
            });
        } catch (error) {
            next(error);
        }
    }
};
