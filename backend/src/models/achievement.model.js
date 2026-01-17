export function findAchievementByCode(knex, code) {
    return knex("achievements")
        .where({ code, enabled: true })
        .first();
}

export function getAchievements(knex, gameSlug = null) {
    let query = knex("achievements")
        .join("games", "achievements.game_id", "games.id")
        .select(
            "achievements.id",
            "achievements.code",
            "achievements.name",
            "achievements.description",
            "achievements.icon",
            "games.slug as game_slug",
            "games.name as game_name"
        )
        .where("achievements.enabled", true);

    if (gameSlug) {
        query = query.where("games.slug", gameSlug);
    }

    return query;
}
