
// get user after reload, like remember me
export async function getUserApi() {
    console.log("Fontend-User-Service: Get user API input: ");

    const response = await fetch("/api/user/me", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Get profile failed");
    }

    console.log("Fontend-User-Service: Get profile API output: ", data);
    return data;
}

// Get profile
export async function getProfileApi() {
    console.log("Fontend-Auth-Service: Get profile API input: ");

    const response = await fetch("/api/user/profile", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Get profile failed");
    }

    console.log("Fontend-Auth-Service: Get profile API output: ", data);
    return data;
}

// Edit profile
export async function editProfileApi(payload) {
    console.log("Fontend-Auth-Service: Edit profile API input: ", payload);

    const response = await fetch("/api/user/profile", {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Edit profile failed");
    }

    console.log("Fontend-Auth-Service: Edit profile API output: ", data);
    return data;
}

// Get all users
// Get all users
export async function getAllUsersApi(page = 1, limit = 10, search = "") {
    console.log("Fontend-User-Service: Get all users API input: ", page, limit, search);

    const response = await fetch(`/api/user/all?page=${page}&limit=${limit}&search=${search}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to get users");
    }

    console.log("Fontend-User-Service: Get all users API output: ", data);
    return data;
}

// Update User State
export async function updateUserStateApi(userId, state) {
    const response = await fetch(`/api/user/${userId}/state`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ state }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update user state");
    }

    return data;
}

// Get friend requests
export async function getFriendRequestsApi(page = 1, limit = 10, search = "") {
    console.log("Fontend-User-Service: Get friend requests API input: ", page, limit, search);

    const response = await fetch(`/api/user/friend-requests?page=${page}&limit=${limit}&search=${search}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Get friend requests failed");
    }

    console.log("Fontend-User-Service: Get friend requests API output: ", data);
    return data;
}

