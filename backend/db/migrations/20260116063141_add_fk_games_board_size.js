export async function up(knex) {
    await knex.schema.alterTable("games", table => {
        table
            .foreign("board_size")
            .references("id")
            .inTable("board_configs")
            .onDelete("RESTRICT"); // hoặc CASCADE / SET NULL tuỳ bạn
    });
}

export async function down(knex) {
    await knex.schema.alterTable("games", table => {
        table.dropForeign("board_size");
    });
}