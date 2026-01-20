import { API_BASE } from "@/lib/api";

// Login
export async function loginApi(payload) {
    console.log("Fontend-Auth-Service: Login API input: ", payload);

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

    console.log("Fontend-Auth-Service: Login API output: ", data);
    return data;
}

// Register
export async function registerApi(payload) {
    console.log("Fontend-Auth-Service: Register API input: ", payload);

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

    console.log("Fontend-Auth-Service: Register API output: ", data);
    return data;
}

// Verify email
export async function verifyEmailApi(payload) {
    console.log("Fontend-Auth-Service: Verify email API input: ", payload);

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

    console.log("Fontend-Auth-Service: Verify email API output: ", data);
    return data;
}

// Resend OTP
export async function resendOTPApi(email) {
    console.log("Fontend-Auth-Service: Resend OTP API input: ", email);

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

    console.log("Fontend-Auth-Service: Resend OTP API output: ", data);
    // return data;
}

// Log out
export async function logoutApi() {
    // Clear token from localStorage
    localStorage.removeItem('access_token');
}
