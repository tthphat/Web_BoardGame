import knex from "../../db/db.js";

export const GameSessionModel = {
    /**
     * Save or update a game session
     * @param {number} userId
     * @param {number} gameId
     * @param {object} state - JSON game state
     */
    async upsertSession(userId, gameId, state) {
        try {
            const existing = await knex("game_sessions")
                .where({ user_id: userId, game_id: gameId })
                .first();

            if (existing) {
                const [updated] = await knex("game_sessions")
                    .where({ user_id: userId, game_id: gameId })
                    .update({
                        state: JSON.stringify(state),
                        updated_at: new Date()
                    })
                    .returning("*");
                return { data: updated, error: null };
            } else {
                const [inserted] = await knex("game_sessions")
                    .insert({
                        user_id: userId,
                        game_id: gameId,
                        state: JSON.stringify(state),
                        created_at: new Date(),
                        updated_at: new Date()
                    })
                    .returning("*");
                return { data: inserted, error: null };
            }
        } catch (error) {
            console.error("GameSessionModel.upsertSession error:", error);
            return { data: null, error };
        }
    },

    /**
     * Get a game session by user and game
     * @param {number} userId
     * @param {number} gameId
     */
    async getSession(userId, gameId) {
        try {
            const session = await knex("game_sessions")
                .where({ user_id: userId, game_id: gameId })
                .first();
            return { data: session, error: null };
        } catch (error) {
            console.error("GameSessionModel.getSession error:", error);
            return { data: null, error };
        }
    }
};
