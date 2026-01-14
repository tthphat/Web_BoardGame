export function up(knex) {
    return knex.schema.createTable("ratings", table => {
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

        table.integer("rating").notNullable(); // 1–5
        table.text("comment");

        table.timestamps(true, true);

        table.unique(["user_id", "game_id"]); // 1 user chỉ đánh giá 1 lần / game
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("ratings");
}
