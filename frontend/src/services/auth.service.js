export async function loginApi(payload) {
    console.log("Fontend-Auth-Service: Login API input: ", payload);

    const response = await fetch("api/auth/login", {
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