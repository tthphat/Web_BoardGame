
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
export async function getAllUsersFriendApi(page, limit, search) {
    console.log("Fontend-User-Service: Get all users API input: ", page, limit, search);

    const response = await fetch(`/api/user/all-users?page=${page}&limit=${limit}&search=${search}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Get all users failed");
    }

    console.log("Fontend-User-Service: Get all users API output: ", data);
    return data;
}

// Get friend requests
export async function getFriendRequestsApi(page, limit, search) {
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

// get my friend list
export async function getMyFriendsApi(page, limit, search) {
    console.log("Fontend-User-Service: Get my friends API input: ", page, limit, search);

    const response = await fetch(`/api/user/my-friends?page=${page}&limit=${limit}&search=${search}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Get my friends failed");
    }

    console.log("Fontend-User-Service: Get my friends API output: ", data);
    return data;
}

// Add friend
export async function addFriendApi(userId) {
    console.log("Fontend-User-Service: Add friend API input: ", userId);

    const response = await fetch(`/api/user/friend-requests`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Add friend failed");
    }

    console.log("Fontend-User-Service: Add friend API output: ", data);
    return data;
}