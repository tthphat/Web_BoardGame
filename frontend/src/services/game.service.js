import { API_BASE } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

// Get enabled games (public)
export async function getEnabledGamesApi() {
    const response = await fetch(`${API_BASE}/api/games/enabled`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch enabled games");
    }

    return data;
}

// Get all games (admin only)
export async function getAllGamesApi() {
    const response = await fetch(`${API_BASE}/api/games/all`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch all games");
    }

    return data;
}

// Toggle game enabled status (admin only)
export async function toggleGameApi(gameId, enabled) {
    const response = await fetch(`${API_BASE}/api/games/toggle`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ gameId, enabled }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to toggle game");
    }

    return data;
}

// Finish game (authenticated user)
export async function finishGameApi(gameSlug, result) {
    const response = await fetch(`${API_BASE}/api/games/finish`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ gameSlug, result }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to finish game");
    }

    return data;
}

// Get leaderboard for a game (protected)
export async function getLeaderboardApi(gameSlug, limit = 3, options = {}) {
    let url = `${API_BASE}/api/games/${gameSlug}/leaderboard?limit=${limit}`;
    if (options.filter) url += `&filter=${options.filter}`;
    if (options.userId) url += `&userId=${options.userId}`;
    if (options.page) url += `&page=${options.page}`;

    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch leaderboard");
    }

    return data;
}

// Get all leaderboards (protected)
export async function getAllLeaderboardsApi(limit = 3, options = {}) {
    let url = `${API_BASE}/api/games/leaderboard?limit=${limit}`;
    if (options.filter) url += `&filter=${options.filter}`;
    if (options.userId) url += `&userId=${options.userId}`;

    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch all leaderboards");
    }

    return data;
}

// Get current user's game stats (authenticated)
export async function getUserStatsApi() {
    const response = await fetch(`${API_BASE}/api/games/my-stats`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch user stats");
    }

    return data;
}

// Get user's stats for a specific game (authenticated)
export async function getGameStatsApi(gameSlug) {
    const response = await fetch(`${API_BASE}/api/games/my-stats/${gameSlug}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch game stats");
    }

    return data;
}

// Save game session (authenticated)
export async function saveGameSessionApi(slug, state) {
    const response = await fetch(`${API_BASE}/api/games/save`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ slug, state }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to save game");
    }

    return data;
}

// Load game session (authenticated)
export async function loadGameSessionApi(slug) {
    const response = await fetch(`${API_BASE}/api/games/load/${slug}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to load game");
    }

    return data;
}

// board configs
export async function getBoardConfigsApi() {
    const response = await fetch(`${API_BASE}/api/games/board-configs`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch board configs");
    }

    return data;
}