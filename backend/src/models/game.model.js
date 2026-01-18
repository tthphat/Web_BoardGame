import knex from "../../db/db.js";

export const GameModel = {
    // Find all games
    async findAll() {
        try {
            const games = await knex("games")
                .select("*")
                .orderBy("id", "asc");
            return { data: games, error: null };
        } catch (error) {
            console.error("GameModel.findAll error:", error);
            return { data: null, error };
        }
    },

    // Update game state (enable/disable)
    async updateState(id, enabled) {
        try {
            const [game] = await knex("games")
                .where({ id })
                .update({
                    enabled,
                    updated_at: new Date()
                })
                .returning("*");

            return { data: game, error: null };
        } catch (error) {
            console.error("GameModel.updateState error:", error);
            return { data: null, error };
        }
    }
};
