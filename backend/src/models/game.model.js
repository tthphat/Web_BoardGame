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

    // Get enabled games only (public)
    async getEnabledGames() {
        try {
            const games = await knex("games")
                .select("id", "name", "slug", "board_size", "enabled")
                .where({ enabled: true })
                .orderBy("id", "asc");
            return { data: games, error: null };
        } catch (error) {
            console.error("GameModel.getEnabledGames error:", error);
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

