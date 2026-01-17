import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req, res, next) {
    const header = req.cookies.access_token;

    console.log("Backend-auth.middleware.js-verifyToken header: ", header);

    if (!header) return res.status(401).json({ error: "Missing token" });

    try {
        const decoded = jwt.verify(header, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, email }
        console.log("Backend-auth.middleware.js-verifyToken decoded: ", decoded);
        next();
    } catch (err) {
        console.log("Backend-auth.middleware.js-verifyToken error: ", err);
        res.status(401).json({ error: "Invalid token" });
    }
}
