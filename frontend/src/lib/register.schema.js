import { z } from "zod";

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required"),

    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long"),

    confirmPassword: z
        .string()
        .min(1, "Confirm Password is required")
        .min(6, "Confirm Password must be at least 6 characters long"),

    username: z
        .string()
        .min(1, "Username is required")
        .min(3, "Username must be at least 3 characters long"),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })