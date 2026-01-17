import {
    findAchievementByCode
} from "../models/achievement.model.js";

import {
    addUserAchievement,
    getUserAchievements
} from "../models/userAchievement.model.js";

export class AchievementService {
    static async grantAchievementService(knex, userId, code, meta) {
        const achievement = await findAchievementByCode(knex, code);
        if (!achievement) return null;

        await addUserAchievement(knex, {
            userId,
            achievementId: achievement.id,
            meta
        });

        return achievement;
    }

    static async getUserAchievementsService(knex, userId, gameSlug, searchName) {
        return await getUserAchievements(knex, userId, gameSlug, searchName);
    }
}
