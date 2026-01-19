export async function up(knex) {
    await knex.schema.createTable("conversations", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.text("type").notNullable().defaultTo("direct"); // direct | group
        table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("conversations");
}
