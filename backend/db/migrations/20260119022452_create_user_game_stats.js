/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("user_game_stats", (table) => {
        table.increments("id").primary();

        // Foreign keys
        table
            .uuid("user_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table
            .integer("game_id")
            .notNullable()
            .references("id")
            .inTable("games")
            .onDelete("CASCADE");

        // Score tracking
        table.integer("best_score").defaultTo(0);
        table.integer("total_score").defaultTo(0);

        // Play tracking
        table.integer("total_plays").defaultTo(0);
        table.integer("total_wins").defaultTo(0);
        table.integer("total_losses").defaultTo(0);

        // Time tracking (for Memory game - fastest completion)
        table.integer("best_time_seconds").nullable();

        // Timestamps
        table.timestamps(true, true);

        // Unique constraint: 1 user + 1 game = 1 record
        table.unique(["user_id", "game_id"]);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists("user_game_stats");
}
