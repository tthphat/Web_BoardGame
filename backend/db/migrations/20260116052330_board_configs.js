export function up(knex) {
    return knex.schema.createTable("board_configs", table => {
        table.increments("id").primary();

        table.string("code").notNullable().unique();
        // MEDIUM, LARGE, EXTRA_LARGE

        table.integer("cols").notNullable();
        table.integer("rows").notNullable();
        table.integer("dot_size").notNullable();
        table.integer("gap").notNullable();

        // table.boolean("enabled").defaultTo(true); // soft-delete EXPANDSION future
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("board_configs");
}
