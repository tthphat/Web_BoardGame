import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const AuthService = {
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


}

