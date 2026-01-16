import {
    findAchievementByCode
} from "../models/achievement.model.js";

import {
    addUserAchievement
} from "../models/userAchievement.model.js";

export class AchievementService {
    static async grantAchievement(knex, userId, code, meta) {
        const achievement = await findAchievementByCode(knex, code);
        if (!achievement) return null;

        await addUserAchievement(knex, {
            userId,
            achievementId: achievement.id,
            meta
        });

        return achievement;
    }
}
