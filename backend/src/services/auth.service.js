import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const AuthService = {
    // login
    async login(email, password) {
        try {
            // check existed user
            const { data: user, error } = await UserModel.findUserByEmail(email);
            if (error || !user) {
                throw new Error("User not found");
            }

            // check user state
            if (user.state !== "active") {
                throw new Error("User is locked");
            }

            // check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid password");
            }
            // generate token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return {
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role
                    }
                }
            };
        } catch (error) {
            next(error);
        }
    },

    // Register
    async register(email, password) {
        try {
            // check existed user
            const { data: user } = await UserModel.findUserByEmail(email);
            if (user) {
                if (user.state === "peding") {
                    await UserModel.deleteUser(user.id);
                } else {
                    throw new Error("User already exists");
                }
            }

            // hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // tạo otp
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Hash OTP
            const otp_hash = crypto
                .createHash("sha256")
                .update(otp)
                .digest("hex");

            const otp_expires = Date.now() + 3 * 60 * 1000; // 3 phút
            const otp_attempts = 0;

            // create user
            const { data: newUser } = await UserModel.createUser({
                email,
                password: hashedPassword,
                role: "user",
                state: "peding",
                otp_hash,
                otp_expires,
                otp_attempts
            });

            // send otp
            await sendOtp(email, otp);

            return {
                data: {
                    user: {
                        email: newUser.email,
                    }
                }
            };
        } catch (error) {
            next(error);
        }
    }
}

