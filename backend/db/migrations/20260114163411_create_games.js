export function up(knex) {
    return knex.schema.createTable("games", table => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("slug").notNullable().unique(); // tic-tac-toe, caro, candy
        table.integer("board_size").notNullable();
        table.boolean("enabled").defaultTo(true);
        table.timestamps(true, true);
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("games");
}
