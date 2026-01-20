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
        const errorMsg = data.message || data.error || "Failed to submit rating";
        throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
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
        const errorMsg = data.message || data.error || "Failed to fetch ratings";
        throw new Error(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    }

    return data;
}
