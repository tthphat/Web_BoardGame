import { API_BASE } from "@/lib/api";

// Login
export async function loginApi(payload) {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed");
    }

    // Store token in localStorage
    if (data.data?.token) {
        localStorage.setItem('access_token', data.data.token);
    }
    return data;
}

// Register
export async function registerApi(payload) {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Register failed");
    }

    return data;
}

// Verify email
export async function verifyEmailApi(payload) {
    const response = await fetch(`${API_BASE}/api/auth/verify-email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Verify email failed");
    }

    // Store token in localStorage
    if (data.data?.token) {
        localStorage.setItem('access_token', data.data.token);
    }
    return data;
}

// Resend OTP
export async function resendOTPApi(email) {
    const response = await fetch(`${API_BASE}/api/auth/resend-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Resend OTP failed");
    }
    // return data;
}

// Log out
export async function logoutApi() {
    // Clear token from localStorage
    localStorage.removeItem('access_token');
}
