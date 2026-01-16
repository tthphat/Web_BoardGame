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

export function getUserAchievements(knex, userId, gameSlug = null) {
    let query = knex("user_achievements")
        .join("achievements", "user_achievements.achievement_id", "achievements.id")
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
        .orderBy("user_achievements.earned_at", "desc");

    if (gameSlug) {
        // Assuming 'icon' column in achievements table holds the game slug/type identifier
        query = query.where("achievements.icon", gameSlug);
    }

    return query;
}
