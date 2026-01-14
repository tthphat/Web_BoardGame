export function up(knex) {
    return knex.schema.createTable("friends", table => {
        table
            .uuid("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table
            .uuid("friend_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");

        table
            .enu("status", ["pending", "accepted"])
            .defaultTo("pending");

        table.primary(["user_id", "friend_id"]);
    });
}

export function down(knex) {
    return knex.schema.dropTableIfExists("friends");
}
