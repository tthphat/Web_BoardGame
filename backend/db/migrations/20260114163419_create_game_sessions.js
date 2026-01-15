export function up(knex) {
    return knex.schema.createTable("game_sessions", table => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

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

        table.jsonb("state").notNullable(); // board, turn, moves
        table.integer("score").defaultTo(0);

        table
            .enu("status", ["playing", "finished"])
            .defaultTo("playing");

        table.timestamps(true, true);
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("game_sessions");
}
