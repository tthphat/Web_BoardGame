import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/login.schema";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { API_BASE } from "@/lib/api";

function ApiDocs() {
    const { login } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await login(data);
            // Check if token exists in response or localStorage (auth service handles storage)
            const token = response.data?.data?.token || response.data?.token || localStorage.getItem('access_token');

            if (token) {
                // Ensure token is stored
                if (!localStorage.getItem('access_token')) {
                    localStorage.setItem('access_token', token);
                }
                setIsAuthenticated(true);
                toast.success("Login successfully");
            } else {
                toast.error("Login verified but no token returned");
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed");
            setError("email", { message: error.message || "Login failed" });
        }
    }

    const requestInterceptor = (req) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            req.headers['Authorization'] = `Bearer ${token}`;
        }
        req.headers['x-api-key'] = import.meta.env.VITE_API_KEY;
        return req;
    };

    if (isAuthenticated) {
        return (
            <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
                <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-10">
                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">← Back to Admin</Link>
                        <h1 className="text-xl font-bold">API Documentation</h1>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('access_token');
                            setIsAuthenticated(false);
                            toast.info("Logged out from API Docs");
                        }}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition-colors font-bold"
                    >
                        LOGOUT
                    </button>
                </div>
                <div className="flex-1 overflow-auto bg-[#fafafa]">
                    <div className="container mx-auto py-8 px-4">
                        <SwaggerUI
                            url={`${API_BASE}/api-docs/swagger.json`}
                            requestInterceptor={requestInterceptor}
                            docExpansion="list"
                            persistAuthorization={true}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-retro-teal dark:bg-[#1a1a1a] font-mono">
            {/* Main Container: Style Retro Raised 3D */}
            <div className="w-[400px] bg-retro-silver dark:bg-[#2d2d2d] 
                border-2 
                border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow 
                dark:border-t-[#606060] dark:border-l-[#606060] dark:border-b-black dark:border-r-black
                p-1 flex flex-col shadow-xl">

                {/* Title Bar: Style Retro Sunken Inset */}
                <div className="bg-retro-navy dark:bg-[#1a1a1a] px-3 py-1 flex justify-between items-center mb-4 
                    border-b-2 border-b-retro-shadow dark:border-b-black">
                    <h2 className="text-white dark:text-yellow-500 font-bold text-sm uppercase tracking-wider">Login to View Docs</h2>
                    <div className="flex gap-1">
                        <div className="w-4 h-4 bg-retro-silver border border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black"></div>
                        <div className="w-4 h-4 bg-retro-silver border border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black"></div>
                        <div className="w-4 h-4 bg-retro-silver border border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black flex items-center justify-center text-[10px] font-bold">
                            <Link to="/">X</Link>
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-black dark:text-white uppercase">Email:</label>
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full bg-white dark:bg-[#404040] p-2 text-black dark:text-white
                                border-2 
                                border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight
                                dark:border-t-black dark:border-l-black dark:border-b-[#606060] dark:border-r-[#606060]
                                outline-none focus:ring-1 focus:ring-retro-navy"
                            />
                            {errors.email && <p className="text-red-700 dark:text-red-400 text-[10px] font-bold uppercase">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-black dark:text-white uppercase">Password:</label>
                            <input
                                type="password"
                                {...register("password")}
                                className="w-full bg-white dark:bg-[#404040] p-2 text-black dark:text-white
                                border-2 
                                border-t-retro-shadow border-l-retro-shadow border-b-retro-highlight border-r-retro-highlight
                                dark:border-t-black dark:border-l-black dark:border-b-[#606060] dark:border-r-[#606060]
                                outline-none focus:ring-1 focus:ring-retro-navy"
                            />
                            {errors.password && <p className="text-red-700 dark:text-red-400 text-[10px] font-bold uppercase">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-2 bg-retro-silver dark:bg-[#404040] 
                            text-black dark:text-white font-bold uppercase text-sm
                            border-2 
                            border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow 
                            dark:border-t-[#606060] dark:border-l-[#606060] dark:border-b-black dark:border-r-black
                            active:border-t-retro-shadow active:border-l-retro-shadow active:border-b-retro-highlight active:border-r-retro-highlight 
                            active:translate-y-0.5 transition-all
                            disabled:opacity-50
                            hover:bg-retro-navy hover:text-white dark:hover:bg-[#606060] dark:hover:text-yellow-500"
                        >
                            {isSubmitting ? "Access Documentation" : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ApiDocs;
