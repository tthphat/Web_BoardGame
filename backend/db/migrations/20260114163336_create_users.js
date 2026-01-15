export function up(knex) {
    return knex.schema.createTable("users", table => {
        table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        table.string("username").notNullable().unique();
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        table
            .enu("role", ["user", "admin"])
            .notNullable()
            .defaultTo("user");
        table.timestamps(true, true);
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("users");
}
