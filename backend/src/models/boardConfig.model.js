import knex from "../../db/db.js";

export const BoardConfigModel = {
    // Find all board configs
    async findAll() {
        try {
            const configs = await knex("board_configs")
                .select("*")
                .orderBy("id", "asc");
            return { data: configs, error: null };
        } catch (error) {
            console.error("BoardConfigModel.findAll error:", error);
            return { data: null, error };
        }
    },

    // Update board config
    async update(id, data) {
        try {
            const [config] = await knex("board_configs")
                .where({ id })
                .update({
                    ...data,
                    updated_at: new Date()
                })
                .returning("*");

            return { data: config, error: null };
        } catch (error) {
            console.error("BoardConfigModel.update error:", error);
            return { data: null, error };
        }
    },

    // Activate a board config
    async activate(id) {
        try {
            await knex.transaction(async (trx) => {
                // Deactivate all
                await trx("board_configs")
                    .update({ is_active: false, updated_at: new Date() });

                // Activate target
                await trx("board_configs")
                    .where({ id })
                    .update({ is_active: true, updated_at: new Date() });
            });

            return { data: { success: true }, error: null };
        } catch (error) {
            console.error("BoardConfigModel.activate error:", error);
            return { data: null, error };
        }
    }
};
