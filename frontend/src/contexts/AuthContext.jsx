import { useContext, createContext } from "react";
import { useState } from "react";
import { loginApi } from "@/services/auth.service";

const AuthContext = createContext(null);

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
