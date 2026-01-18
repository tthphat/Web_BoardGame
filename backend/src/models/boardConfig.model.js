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
    }
};
