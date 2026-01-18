export async function up(knex) {
    await knex.schema.alterTable("friends", (table) => {
        table
            .timestamp("created_at", { useTz: true })
            .notNullable()
            .defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    await knex.schema.alterTable("friends", (table) => {
        table.dropColumn("created_at");
    });
}
