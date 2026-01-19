// Get Dashboard Stats
export async function getDashboardStatsApi() {
    const response = await fetch("/api/admin/dashboard-stats", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch dashboard stats");
    }

    return data;
}

// Get Recent Activities
export async function getRecentActivitiesApi() {
    const response = await fetch("/api/admin/recent-activities", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
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
    const response = await fetch("/api/admin/games", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || "Failed to fetch games");
    return data;
}

export async function updateGameStateApi(id, enabled) {
    const response = await fetch(`/api/admin/games/${id}/state`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
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
    const response = await fetch("/api/admin/board-configs", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || "Failed to fetch board configs");
    return data;
}

export async function updateBoardConfigApi(id, configData) {
    const response = await fetch(`/api/admin/board-configs/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(configData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || "Failed to update board config");
    return data;
}

export async function activateBoardConfigApi(id) {
    const response = await fetch(`/api/admin/board-configs/${id}/activate`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || "Failed to activate board config");
    return data;
}
