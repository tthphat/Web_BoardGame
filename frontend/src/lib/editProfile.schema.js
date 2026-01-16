import { z } from "zod";

const emptyToUndefined = (v) => (v === "" ? undefined : v);

export const editProfileSchema = z
    .object({
        username: z.preprocess(
            emptyToUndefined,
            z.string()
                .min(1, { message: "Username is required" })
                .optional()
        ),

        email: z.preprocess(
            emptyToUndefined,
            z.string()
                .min(1, { message: "Email is required" })
                .email({ message: "Email is invalid" })
                .optional()
        ),

        oldPassword: z.preprocess(
            emptyToUndefined,
            z.string()
                .min(1, { message: "Old password is required" })
                .min(6, { message: "Password must be at least 6 characters" })
                .optional()
        ),

        password: z.preprocess(
            emptyToUndefined,
            z.string()
                .min(1, { message: "New password is required" })
                .min(6, { message: "New password must be at least 6 characters" })
                .optional()
        ),
    })
    .refine(
        (data) => {
            // If any password field is touched, both become required and must be valid
            const hasNew = !!data.password;
            const hasOld = !!data.oldPassword;

            if (hasNew || hasOld) {
                return hasNew && hasOld;
            }
            return true;
        },
        {
            message: "Both old and new passwords are required to change password",
            path: ["password"],
        }
    )
    .refine(
        (data) => {
            if (data.password && data.oldPassword) {
                return data.password !== data.oldPassword;
            }
            return true;
        },
        {
            message: "New password must be different from old password",
            path: ["password"],
        }
    );
