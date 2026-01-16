export function up(knex) {
    return knex.schema.createTable("achievements", table => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

        table.string("code").notNullable().unique();
        // VD: FIRST_GAME, FIRST_WIN, PLAY_3_GAMES

        table.string("name").notNullable();
        table.text("description");

        table.string("icon"); // optional (URL / icon name)

        table.boolean("enabled").defaultTo(true);

        table.timestamps(true, true);
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("achievements");
}