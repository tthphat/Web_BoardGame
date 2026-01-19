import { GameSessionService } from "../services/gameSession.service.js";

export const GameSessionController = {
    // POST /api/games/save
    async saveSession(req, res) {
        try {
            const userId = req.user.id;
            const { slug, state } = req.body;

            if (!slug || !state) {
                return res.status(400).json({ error: "Missing slug or state" });
            }

            const { data, error } = await GameSessionService.saveSession(userId, slug, state);

            if (error) {
                return res.status(400).json({ error });
            }

            return res.status(200).json({ message: "Game saved successfully", data });
        } catch (error) {
            console.error("GameSessionController.saveSession error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    // GET /api/games/load/:slug
    async loadSession(req, res) {
        try {
            const userId = req.user.id;
            const { slug } = req.params;

            if (!slug) {
                return res.status(400).json({ error: "Missing game slug" });
            }

            const { data, error } = await GameSessionService.loadSession(userId, slug);

            if (error) {
                return res.status(404).json({ error });
            }

            if (!data) {
                return res.status(404).json({ message: "No saved game found" });
            }

            return res.status(200).json({ data });
        } catch (error) {
            console.error("GameSessionController.loadSession error:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};
