/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.alterTable("user_game_stats", (table) => {
        table.string("name").nullable(); // Username/display name for leaderboard
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.alterTable("user_game_stats", (table) => {
        table.dropColumn("name");
    });
}
