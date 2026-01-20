export function addUserAchievement(knex, {
    userId,
    achievementId,
    meta = null
}) {
    return knex("user_achievements")
        .insert({
            user_id: userId,
            achievement_id: achievementId,
            meta
        })
        .onConflict(["user_id", "achievement_id"])
        .ignore();
}

export function getUserAchievements(knex, userId, gameSlug = null, searchName = null) {
    let query = knex("user_achievements")
        .join("achievements", "user_achievements.achievement_id", "achievements.id")
        .join("games", "achievements.game_id", "games.id")
        .select(
            "achievements.id",
            "achievements.code",
            "achievements.name",
            "achievements.description",
            "achievements.icon",
            "user_achievements.earned_at",
            "user_achievements.meta"
        )
        .where("user_achievements.user_id", userId)
        .where("games.enabled", true)
        .orderBy("user_achievements.earned_at", "desc");

    if (gameSlug) {
        query = query.where("games.slug", gameSlug);
    }

    if (searchName) {
        query = query.where("achievements.name", "ilike", `%${searchName}%`);
    }

    return query;
}

export function getUserAchievementProgress(knex, userId, gameSlug = null, searchName = null) {
    let query = knex("achievements")
        .join("games", "achievements.game_id", "games.id")
        .leftJoin("user_achievements", function () {
            this.on("achievements.id", "=", "user_achievements.achievement_id")
                .andOn("user_achievements.user_id", "=", knex.raw("?", [userId]));
        })
        .select(
            "achievements.id",
            "achievements.code",
            "achievements.name",
            "achievements.description",
            "achievements.icon",
            "games.slug as game_slug",
            "games.name as game_name",
            "user_achievements.earned_at",
            "user_achievements.meta"
        )
        .where("achievements.enabled", true)
        .where("games.enabled", true)
        .orderByRaw("user_achievements.earned_at DESC NULLS LAST, achievements.name ASC");

    if (gameSlug) {
        query = query.where("games.slug", gameSlug);
    }

    if (searchName) {
        query = query.where("achievements.name", "ilike", `%${searchName}%`);
    }

    return query;
}
