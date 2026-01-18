export async function getUserAchievementsApi(gameSlug = null, search = null) {
    console.log("Frontend-Achievement-Service: Get achievements API input: ", { gameSlug, search });

    let url = "/api/achievements";
    const params = new URLSearchParams();
    if (gameSlug) params.append("gameSlug", gameSlug);
    if (search) params.append("search", search);

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to fetch achievements");
    }

    console.log("Frontend-Achievement-Service: Get achievements API output: ", data);
    return data;
}
