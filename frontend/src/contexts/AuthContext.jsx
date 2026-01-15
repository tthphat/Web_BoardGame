import { loginApi } from "@/services/auth.service";
import { useContext, createContext, useState } from "react";

const AuthContext = createContext(null);

// // Placeholder for loginApi until we find the actual service
// const loginApi = async (payload) => {
//     console.log("Mock login with:", payload);
//     return { data: { user: { name: "Test User" } } };
// };

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (payload) => {
        try {
            const response = await loginApi(payload);
            setUser(response.data.user);
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
