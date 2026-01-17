import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


export const AuthService = {
    // =============
    // Login
    // =============
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
                { expiresIn: "7d" }
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
            throw error;
        }
    },

    // =============
    // Register
    // =============
    async register(email, password, username) {
        try {
            console.log("Backend-Auth-Service: Register API input: ", { email, password, username });
            // check existed user
            const { data: user } = await UserModel.findUserByEmail(email);
            if (user) {
                if (user.state === "pending") {
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

            const otp_expires = new Date(Date.now() + 3 * 60 * 1000); // 3 phút
            const otp_attempts = 0;

            // create user
            const { data: newUser, error } = await UserModel.createUser({
                email,
                password: hashedPassword,
                username,
                role: "user",
                state: "pending",
                otp_hash,
                otp_expires,
                otp_attempts
            });

            console.log("Backend-Auth-Service: Register API error: ", error);

            console.log("Backend-Auth-Service: Register API output: ", newUser);
            // send otp
            await AuthService.sendOtpEmail(email, otp);

            return {
                data: {
                    user: {
                        email: newUser.email,
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // =============
    // Send Email
    // =============
    async sendOtpEmail(email, otp) {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                sender: {
                    name: process.env.BREVO_SENDER_NAME,
                    email: process.env.BREVO_SENDER_EMAIL,
                },
                to: [{ email }],
                subject: "Mã xác nhận OTP",
                htmlContent: `
          <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
          <h2 style="letter-spacing:2px">${otp}</h2>
          <p>Mã có hiệu lực trong <b>5 phút</b>.</p>
          <p>Nếu không phải bạn, hãy bỏ qua email này.</p>
        `,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error("Brevo send mail failed: " + err);
        }
    },

    // =============
    // Verify OTP
    // =============
    async verifyEmail(email, otp) {
        try {
            const { data: user, error } = await UserModel.findUserByEmail(email);
            if (error || !user) {
                throw new Error("User not found");
            }

            // check expired otp
            if (user.otp_expires < new Date()) {
                throw new Error("OTP expired");
            }

            const otp_hash = crypto
                .createHash("sha256")
                .update(otp)
                .digest("hex");

            if (user.otp_hash !== otp_hash) {
                // Tăng số lần thử
                const newAttempts = (user.otp_attempts || 0) + 1;
                await UserModel.editUser(user.id, { otp_attempts: newAttempts });

                if (newAttempts >= 3) {
                    await UserModel.deleteUser(user.id);
                    throw new Error("Too many attempts. Please register again.");
                }

                throw new Error(`OTP invalid. You have ${3 - newAttempts} attempts left.`);
            }

            // reset otp attempts
            const { error: editError } = await UserModel.editUser(user.id,
                { otp_attempts: 0, otp_hash: null, otp_expires: null, state: "active" });

            if (editError) {
                throw new Error("Failed to edit user");
            }

            // Tạo JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return {
                data: {
                    token,
                    user: {
                        email: user.email,
                        role: user.role,
                        id: user.id,
                        username: user.username,
                    }
                }
            };
        } catch (error) {
            throw error;
        }
    },

    // resend OTP
    async resendOtp(email) {
        try {
            const { data: user, error } = await UserModel.findUserByEmail(email);
            if (error || !user) {
                throw new Error("User not found");
            }

            // tạo otp mới
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Hash OTP
            const otp_hash = crypto
                .createHash("sha256")
                .update(otp)
                .digest("hex");

            const otp_expires = new Date(Date.now() + 3 * 60 * 1000); // 3 phút mới
            const otp_attempts = 0; // Reset số lần thử

            // edit otp
            const { error: editError } = await UserModel.editUser(user.id,
                { otp_hash, otp_expires, otp_attempts });

            if (editError) {
                throw new Error("Lỗi khi cập nhật OTP");
            }

            // send otp
            await AuthService.sendOtpEmail(email, otp);

            return {
                message: "OTP sent successfully"
            };
        } catch (error) {
            throw error;
        }
    },

}

