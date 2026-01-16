import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { InputOTP } from "@/components/ui/input-otp";
import { verifyEmail } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

function VerifyEmail() {
    const navigate = useNavigate();
    const { user } = useAuth();
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
    });

    const onSubmit = async (data) => {
        try {
            await verifyEmail(user.email, data.otp);
            navigate("/login");
        } catch (error) {
            setError("root", { message: error.message });
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputOTP
                    control={control}
                    name="otp"
                    placeholder="000000"
                    length={6}
                />
                {errors.root && <p className="text-red-700 dark:text-red-400 text-[10px] font-bold uppercase">{errors.root.message}</p>}
            </form>
        </div>
    );
}

export default VerifyEmail;
