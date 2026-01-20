export async function addRatingApi(gameSlug, rating, comment) {
    const response = await fetch("/api/games/ratings", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ gameSlug, rating, comment }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to submit rating");
    }

    return data;
}

export async function getGameRatingsApi(gameSlug, page = 1, limit = 10) {
    const response = await fetch(`/api/games/${gameSlug}/ratings?page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to to fetch ratings");
    }

    return data;
}
