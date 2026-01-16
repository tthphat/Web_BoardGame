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

