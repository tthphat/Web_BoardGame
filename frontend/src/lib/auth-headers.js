// Helper function to get headers with Authorization token
export function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    const headers = {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}
