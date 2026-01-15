import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/login.schema";
import { useNavigate } from "react-router-dom";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

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
            await login(data);
            navigate("/");
        } catch (error) {
            setError("root", { message: error.message });
        }
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
                    <h2 className="text-white dark:text-yellow-500 font-bold text-sm uppercase tracking-wider">Login.exe</h2>
                    <div className="flex gap-1">
                        <div className="w-4 h-4 bg-retro-silver border border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black"></div>
                        <div className="w-4 h-4 bg-retro-silver border border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black"></div>
                        <div className="w-4 h-4 bg-retro-silver border border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black flex items-center justify-center text-[10px] font-bold">X</div>
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
                            {isSubmitting ? "Processing..." : "Submit"}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-t-retro-shadow dark:border-t-black text-center text-xs">
                        <span className="text-gray-700 dark:text-gray-400">DON'T HAVE AN ACCOUNT?</span>
                        <br />
                        <a href="/register" className="text-retro-navy dark:text-yellow-500 font-bold hover:underline">REGISTER.EXE</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
