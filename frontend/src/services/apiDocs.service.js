import { API_BASE } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";


export const apiDocs = async () => {
    await fetch(`${API_BASE}/api-docs`, {
        method: 'GET',
        headers: getAuthHeaders(),
    })
}

