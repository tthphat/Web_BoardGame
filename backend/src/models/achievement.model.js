export function findAchievementByCode(knex, code) {
    return knex("achievements")
        .where({ code, enabled: true })
        .first();
}
