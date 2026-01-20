export async function up(knex) {
    await knex.schema.createTable("messages", (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.uuid("conversation_id").notNullable();
        table.uuid("sender_id").notNullable();
        table.text("content").notNullable();
        table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());

        table
            .foreign("conversation_id")
            .references("id")
            .inTable("conversations")
            .onDelete("CASCADE");

        table
            .foreign("sender_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.index(["conversation_id", "created_at"]);
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("messages");
}
