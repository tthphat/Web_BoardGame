// Get enabled games (public)
export async function getEnabledGamesApi() {
    const response = await fetch("/api/games/enabled", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch enabled games");
    }

    return data;
}

// Get all games (admin only)
export async function getAllGamesApi() {
    const response = await fetch("/api/games/all", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch all games");
    }

    return data;
}

// Toggle game enabled status (admin only)
export async function toggleGameApi(gameId, enabled) {
    const response = await fetch("/api/games/toggle", {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
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
    const response = await fetch("/api/games/finish", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ gameSlug, result }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to finish game");
    }

    return data;
}
