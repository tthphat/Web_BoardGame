export async function up(knex) {
    await knex.schema.alterTable("users", table => {
        table
            .enu("state", ["active", "lock", "pending"], {
                useNative: true,
                enumName: "user_state"
            })
            .notNullable()
            .defaultTo("active");
    });
}

export async function down(knex) {
    await knex.schema.alterTable("users", table => {
        table.dropColumn("state");
    });

    await knex.raw('DROP TYPE IF EXISTS "user_state"');
}
