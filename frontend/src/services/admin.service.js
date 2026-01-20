import { API_BASE } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

// Get Dashboard Stats
export async function getDashboardStatsApi() {
    const response = await fetch(`${API_BASE}/api/admin/dashboard-stats`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch dashboard stats");
    }

    return data;
}

// Get Recent Activities
export async function getRecentActivitiesApi() {
    const response = await fetch(`${API_BASE}/api/admin/recent-activities`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch recent activities");
    }

    return data;
}

// =============
// Game Management
// =============
export async function getAllGamesApi() {
    const response = await fetch(`${API_BASE}/api/admin/games`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || "Failed to fetch games");
    return data;
}

export async function updateGameStateApi(id, enabled) {
    const response = await fetch(`${API_BASE}/api/admin/games/${id}/state`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || "Failed to update game state");
    return data;
}

// =============
// Board Config Management
// =============
export async function getAllBoardConfigsApi() {
    const response = await fetch(`${API_BASE}/api/admin/board-configs`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || "Failed to fetch board configs");
    return data;
}

export async function updateBoardConfigApi(id, configData) {
    const response = await fetch(`${API_BASE}/api/admin/board-configs/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(configData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || "Failed to update board config");
    return data;
}

export async function activateBoardConfigApi(id) {
    const response = await fetch(`${API_BASE}/api/admin/board-configs/${id}/activate`, {
        method: "PUT",
        headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || "Failed to activate board config");
    return data;
}
// Get Detailed Statistics
export async function getStatisticsApi(period = '30d') {
    const response = await fetch(`${API_BASE}/api/admin/statistics?period=${period}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch statistics");
    }

    return data;
}

export const adminService = {
    getDashboardStats: getDashboardStatsApi,
    getRecentActivities: getRecentActivitiesApi,
    getAllGames: getAllGamesApi,
    updateGameState: updateGameStateApi,
    getAllBoardConfigs: getAllBoardConfigsApi,
    updateBoardConfig: updateBoardConfigApi,
    activateBoardConfig: activateBoardConfigApi,
    getStatistics: getStatisticsApi // Added here
};
