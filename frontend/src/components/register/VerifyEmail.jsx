import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";

function VerifyEmail() {
    const navigate = useNavigate();
    const { user, verifyEmail } = useAuth();
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        setError,
    } = useForm({
        resolver: zodResolver(z.object({
            otp: z
                .string()
                .min(6, "Mã OTP phải có ít nhất 6 ký tự")
                .max(6, "Mã OTP phải có ít nhất 6 ký tự"),
        })),
        defaultValues: {
            otp: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            await verifyEmail({ email: user.email, otp: data.otp });
            navigate("/login");
        } catch (error) {
            setError("otp", { message: error.message });
        }
    }


    return (
        <div className="h-screen w-screen flex items-center justify-center bg-retro-teal dark:bg-[#1a1a1a] font-mono">
            <div className=" p-2 shadow-lg max-w-md w-full
                bg-retro-silver dark:bg-[#2d2d2d] 
                border-2 
                border-t-retro-highlight border-l-retro-highlight border-b-retro-shadow border-r-retro-shadow 
                dark:border-t-[#606060] dark:border-l-[#606060] dark:border-b-black dark:border-r-black
                p-1 flex flex-col shadow-xl">

                {/* Title Bar: Style Retro Sunken Inset */}
                <div className="bg-retro-navy dark:bg-[#1a1a1a] px-3 py-1 flex justify-between items-center mb-4 
                    border-b-2 border-b-retro-shadow dark:border-b-black">
                    <h2 className="text-white dark:text-yellow-500 font-bold text-sm uppercase tracking-wider">VerifyEmail.exe</h2>
                    <div className="flex gap-1">
                        <div className="w-4 h-4 bg-retro-silver border border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black"></div>
                        <div className="w-4 h-4 bg-retro-silver border border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black"></div>
                        <div className="w-4 h-4 bg-retro-silver border border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black flex items-center justify-center text-[10px] font-bold">X</div>
                    </div>
                </div>

                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Input OTP is sent to your email: <strong>{user?.email}</strong>
                </p>

                <div className="p-6 pt-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col items-center">
                            <Controller
                                name="otp"
                                control={control}
                                render={({ field }) => (
                                    <InputOTP
                                        maxLength={6}
                                        value={field.value}
                                        onChange={field.onChange}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                )}
                            />
                            {errors.otp && (
                                <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                                    {errors.otp.message}
                                </p>
                            )}
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
                            {isSubmitting ? "Processing..." : "Verify"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
