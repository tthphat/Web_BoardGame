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
    }
};
