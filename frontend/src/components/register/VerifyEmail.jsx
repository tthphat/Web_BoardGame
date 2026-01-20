import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { resendOTPApi } from "@/services/auth.service";

function VerifyEmail() {
    const navigate = useNavigate();
    const { user, verifyEmail } = useAuth();

    // countdown resend otp
    const [countdown, setCountdown] = useState(10); // 3 phút
    const [canResend, setCanResend] = useState(false);

    // Timer countdown
    useEffect(() => {
        let timer;
        if (countdown > 0 && !canResend) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [countdown, canResend]);

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
            toast.success("Register successfully");
            navigate("/login", { replace: true });
        } catch (error) {
            toast.error(error.message);
            setError("otp", { message: error.message });

            if (error.message && (error.message.includes("Too many attempts. Please register again."))) {
                setTimeout(() => {
                    navigate("/register");
                }, 2000);
            }

            if (error.message && error.message.includes("OTP expired")) {
                setCanResend(true);
                setCountdown(0);
            }
        }
    }

    const handleResend = async () => {
        try {
            await resendOTPApi(user.email);

            // Success
            setCountdown(10);
            setCanResend(false);

        } catch (error) {
            console.error(error);
            setError("otp", {
                type: "manual",
                message: error.message,
            });
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

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
                        <div className="w-4 h-4 bg-retro-silver border border-t-retro-highlight border-l-retro-highlight border-b-black border-r-black flex items-center justify-center text-[10px] font-bold">
                            <Link to="/login">X</Link>
                        </div>
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

                        {/* Resend Logic */}
                        <div className="text-center">
                            {!canResend ? (
                                <p className="text-sm text-gray-500">
                                    Resend OTP after <span className="font-bold">{formatTime(countdown)}</span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-[#43A047] font-semibold hover:text-[#4caf50] hover:underline text-sm"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
