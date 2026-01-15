import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { resolver } from "@hookform/resolvers/zod";

function Login() {
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        resolver: resolver(loginSchema),
    });

}

export default Login;
