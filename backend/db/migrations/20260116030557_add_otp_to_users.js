export async function up(knex) {
    await knex.schema.alterTable("users", table => {
        table.string("otp_hash");
        table.timestamp("otp_expires");
        table.integer("otp_attempts").defaultTo(0);
    });
}

export async function down(knex) {
    await knex.schema.alterTable("users", table => {
        table.dropColumn("otp_hash");
        table.dropColumn("otp_expires");
        table.dropColumn("otp_attempts");
    });
}
