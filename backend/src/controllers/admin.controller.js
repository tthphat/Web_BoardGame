import { AdminService } from "../services/admin.service.js";

export const AdminController = {
    // =============
    // Get Dashboard Stats
    // =============
    async getDashboardStats(req, res, next) {
        try {
            const result = await AdminService.getDashboardStats();
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // =============
    // Get Recent Activities
    // =============
    async getRecentActivities(req, res, next) {
        try {
            const result = await AdminService.getRecentActivities();
            res.json(result);
        } catch (error) {
            next(error);
        }

    },
    // ... (previous code)

    // =============
    // Game Management
    // =============
    async getAllGames(req, res, next) {
        try {
            const result = await AdminService.getAllGames();
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async updateGameState(req, res, next) {
        try {
            const { id } = req.params;
            const { enabled } = req.body;
            const result = await AdminService.updateGameState(id, enabled);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // =============
    // Board Config Management
    // =============
    async getAllBoardConfigs(req, res, next) {
        try {
            const result = await AdminService.getAllBoardConfigs();
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async updateBoardConfig(req, res, next) {
        try {
            const { id } = req.params;
            const configData = req.body;
            const result = await AdminService.updateBoardConfig(id, configData);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async activateBoardConfig(req, res, next) {
        try {
            const { id } = req.params;
            const result = await AdminService.activateBoardConfig(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
};
