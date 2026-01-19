import { GameSessionModel } from "../models/gameSession.model.js";
import knex from "../db/db.js";

export const GameSessionService = {
    /**
     * Save game session
     * @param {number} userId
     * @param {string} gameSlug
     * @param {object} state
     */
    async saveSession(userId, gameSlug, state) {
        // 1. Get game ID from slug
        const game = await knex("games").where({ slug: gameSlug }).first();
        if (!game) {
            return { data: null, error: "Game not found" };
        }

        // 2. Save session
        return await GameSessionModel.upsertSession(userId, game.id, state);
    },

    /**
     * Load game session
     * @param {number} userId
     * @param {string} gameSlug
     */
    async loadSession(userId, gameSlug) {
        // 1. Get game ID from slug
        const game = await knex("games").where({ slug: gameSlug }).first();
        if (!game) {
            return { data: null, error: "Game not found" };
        }

        // 2. Load session
        return await GameSessionModel.getSession(userId, game.id);
    }
};
