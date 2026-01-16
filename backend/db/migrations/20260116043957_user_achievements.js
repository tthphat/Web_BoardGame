export function up(knex) {
    return knex.schema.createTable("user_achievements", table => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

        table
            .uuid("user_id")
            .notNullable()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table
            .uuid("achievement_id")
            .notNullable()
            .references("id")
            .inTable("achievements")
            .onDelete("CASCADE");

        table
            .timestamp("earned_at")
            .notNullable()
            .defaultTo(knex.fn.now());

        table.jsonb("meta");
        // VD: { game_id: 1, score: 120 }

        table.unique(["user_id", "achievement_id"]);
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("user_achievements");
}
