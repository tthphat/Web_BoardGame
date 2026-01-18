import { loginApi, registerApi, verifyEmailApi, logoutApi } from "@/services/auth.service";
import { useContext, createContext, useState } from "react";
import { toast } from "sonner";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Login
    const login = async (payload) => {
        setLoading(true);
        try {
            const response = await loginApi(payload);
            setUser(response.data.user);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Register
    const signup = async (payload) => {
        setLoading(true);
        try {
            const response = await registerApi(payload);
            setUser(response.data.user);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // verify email
    const verifyEmail = async (payload) => {
        setLoading(true);
        try {
            const response = await verifyEmailApi(payload);
            setUser(response.data.user);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        setLoading(true);
        try {
            await logoutApi();
            setUser(null);
        } catch (error) {
            toast.error(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, loading, setUser, verifyEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
