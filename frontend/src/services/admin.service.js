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
