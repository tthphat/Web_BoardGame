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
