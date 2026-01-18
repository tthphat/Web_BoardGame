export async function up(knex) {
    await knex.schema.alterTable("friends", (table) => {
        table.timestamp("accepted_at", { useTz: true }).nullable();
    });
}

export async function down(knex) {
    await knex.schema.alterTable("friends", (table) => {
        table.dropColumn("accepted_at");
    });
}
