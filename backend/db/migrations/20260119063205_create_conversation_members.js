export async function up(knex) {
    await knex.schema.createTable("conversation_members", (table) => {
        table.uuid("conversation_id").notNullable();
        table.uuid("user_id").notNullable();
        table.timestamp("joined_at", { useTz: true }).defaultTo(knex.fn.now());

        table.primary(["conversation_id", "user_id"]);

        table
            .foreign("conversation_id")
            .references("id")
            .inTable("conversations")
            .onDelete("CASCADE");

        table
            .foreign("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table.index("user_id");
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("conversation_members");
}
