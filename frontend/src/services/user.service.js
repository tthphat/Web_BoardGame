import { API_BASE } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";


// get user after reload, like remember me
export async function getUserApi() {
    console.log("Fontend-User-Service: Get user API input: ");

    const response = await fetch(`${API_BASE}/api/user/me`, {
        method: "GET",
        headers: getAuthHeaders(),
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

    const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: "GET",
        headers: getAuthHeaders(),
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

    const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PATCH",
        headers: getAuthHeaders(),
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
export async function getAllUsersApi(page = 1, limit = 10, search = "") {
    console.log("Fontend-User-Service: Get all users API input: ", page, limit, search);

    const response = await fetch(`${API_BASE}/api/user/all?page=${page}&limit=${limit}&search=${search}`, {
        method: "GET",
        headers: getAuthHeaders(),
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
    const response = await fetch(`${API_BASE}/api/user/${userId}/state`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ state }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update user state");
    }

    return data;
}

// Get all users friend
export async function getAllUsersFriendApi(page, limit, search) {
    console.log("Fontend-User-Service: Get all users API input: ", page, limit, search);

    const response = await fetch(`${API_BASE}/api/user/all-users?page=${page}&limit=${limit}&search=${search}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Get all users failed");
    }

    console.log("Fontend-User-Service: Get all users API output: ", data);
    return data;
}

// Get friend requests
export async function getFriendRequestsApi(page = 1, limit = 10, search = "") {
    console.log("Fontend-User-Service: Get friend requests API input: ", page, limit, search);

    const response = await fetch(`${API_BASE}/api/user/friend-requests?page=${page}&limit=${limit}&search=${search}`, {
        method: "GET",
        headers: getAuthHeaders(),
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

    const response = await fetch(`${API_BASE}/api/user/my-friends?page=${page}&limit=${limit}&search=${search}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Get my friends failed");
    }

    console.log("Fontend-User-Service: Get my friends API output: ", data);
    return data;
}

// Add friend
export async function addFriendApi(user_id) {
    console.log("Fontend-User-Service: Add friend API input: ", user_id);

    const response = await fetch(`${API_BASE}/api/user/add-friend`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ user_id }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Add friend failed");
    }

    console.log("Fontend-User-Service: Add friend API output: ", data);
}

// Accept friend request
export async function acceptFriendApi(sender_id) {
    console.log("Fontend-User-Service: Accept friend API input: ", sender_id);

    const response = await fetch(`${API_BASE}/api/user/accept-friend`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ sender_id }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Accept friend failed");
    }

    console.log("Fontend-User-Service: Accept friend API output: ", data);
}

// Reject friend request
export async function rejectFriendApi(sender_id) {
    console.log("Fontend-User-Service: Reject friend API input: ", sender_id);

    const response = await fetch(`${API_BASE}/api/user/reject-friend`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ sender_id }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Reject friend failed");
    }

    console.log("Fontend-User-Service: Reject friend API output: ", data);
}

// remove friend    
export async function removeFriendApi(friend_id) {
    console.log("Fontend-User-Service: Remove friend API input: ", friend_id);

    const response = await fetch(`${API_BASE}/api/user/remove-friend`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ friend_id }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Remove friend failed");
    }

    console.log("Fontend-User-Service: Remove friend API output: ", data);
}

// get all my conversation
export async function getAllMyConversationsApi(page, limit, search) {
    console.log("Fontend-User-Service: Get all my conversations API input: ", page, limit, search);

    const response = await fetch(`${API_BASE}/api/user/all-my-conversations?page=${page}&limit=${limit}&search=${search}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Get all my conversations failed");
    }

    console.log("Fontend-User-Service: Get all my conversations API output: ", data);
    return data;
}

// get messages in a conversation
export async function getMessagesApi(conversation_id, offset, limit) {
    console.log("Fontend-User-Service: Get messages API input: ", conversation_id, offset, limit);

    const response = await fetch(`${API_BASE}/api/user/conversations/${conversation_id}/messages?offset=${offset}&limit=${limit}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Get messages failed");
    }

    console.log("Fontend-User-Service: Get messages API output: ", data);
    return data;
}

// send message
export async function sendMessageApi(conversation_id, message) {
    console.log("Fontend-User-Service: Send message API input: ", conversation_id, message);

    const response = await fetch(`${API_BASE}/api/user/conversations/${conversation_id}/messages`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: message }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Send message failed");
    }

    console.log("Fontend-User-Service: Send message API output: ", data);
    return data;
}

// search users
export async function searchUsersApi(search) {
    console.log("Fontend-User-Service: Search users API input: ", search);

    const response = await fetch(`${API_BASE}/api/user/search?search=${search}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Search users failed");
    }

    console.log("Fontend-User-Service: Search users API output: ", data);
    return data;
}

// fetch user basic info
export async function fetchUserApi(userId) {
    console.log("Fontend-User-Service: Fetch user API input: ", userId);

    const response = await fetch(`${API_BASE}/api/user/get-user/${userId}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Fetch user failed");
    }

    console.log("Fontend-User-Service: Fetch user API output: ", data);
    return data;
}

// send first message
export async function sendFirstMessageApi(userId, message) {
    console.log("Fontend-User-Service: Send first message API input: ", userId, message);

    const response = await fetch(`${API_BASE}/api/user/conversations/${userId}/new`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ content: message }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Send first message failed");
    }

    console.log("Fontend-User-Service: Send first message API output: ", data);
    return data;
}

// check exist conversation
export async function checkExistConversationApi(userId) {
    console.log("Fontend-User-Service: Check exist conversation API input: ", userId);

    const response = await fetch(`${API_BASE}/api/user/conversations/${userId}/exist`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Check exist conversation failed");
    }

    console.log("Fontend-User-Service: Check exist conversation API output: ", data);
    return data;
}

// remove conversation
export async function removeConversationApi(conversation_id) {
    console.log("Fontend-User-Service: Remove conversation API input: ", conversation_id);

    const response = await fetch(`${API_BASE}/api/user/conversations/${conversation_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Remove conversation failed");
    }

    console.log("Fontend-User-Service: Remove conversation API output: ", data);
    return data;
}

