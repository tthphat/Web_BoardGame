import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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

    // =============
    // Register
    // =============
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
            await AuthService.sendOtpEmail(email, otp);

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

}

