export async function up(knex) {
    await knex.schema.alterTable("friends", (table) => {
        table.renameColumn("user_id", "sender_id");
        table.renameColumn("friend_id", "receiver_id");
    });
}

export async function down(knex) {
    await knex.schema.alterTable("friends", (table) => {
        table.renameColumn("sender_id", "user_id");
        table.renameColumn("receiver_id", "friend_id");
    });
}
