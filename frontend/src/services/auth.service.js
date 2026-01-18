// Login
export async function loginApi(payload) {
    console.log("Fontend-Auth-Service: Login API input: ", payload);

    const response = await fetch("/api/auth/login", {
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

    console.log("Fontend-Auth-Service: Login API output: ", data);
    return data;
}

// Register
export async function registerApi(payload) {
    console.log("Fontend-Auth-Service: Register API input: ", payload);

    const response = await fetch("/api/auth/register", {
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

    const response = await fetch("/api/auth/verify-email", {
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

    console.log("Fontend-Auth-Service: Verify email API output: ", data);
    return data;
}

// Resend OTP
export async function resendOTPApi(email) {
    console.log("Fontend-Auth-Service: Resend OTP API input: ", email);

    const response = await fetch("/api/auth/resend-otp", {
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

// Get profile
export async function getProfileApi() {
    console.log("Fontend-Auth-Service: Get profile API input: ");

    const response = await fetch("/api/user/profile", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
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

// Log out
export async function LogoutApi() {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Log out failed");
    }
}
