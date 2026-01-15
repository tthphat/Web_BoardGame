import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/login.schema";

function Login() {
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="w-[400px] p-6 border border-gray-200 rounded-lg flex flex-col gap-4">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <form onSubmit={handleSubmit(login)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" {...register("email")} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" {...register("password")} className="mt-1 p-2 border border-gray-300 rounded w-full" />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
                </form>
                <div className="text-center">
                    Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
