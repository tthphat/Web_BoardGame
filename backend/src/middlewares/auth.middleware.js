import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    console.log("Backend-auth.middleware.js-verifyToken authHeader: ", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, email }
        console.log("Backend-auth.middleware.js-verifyToken decoded: ", decoded);
        next();
    } catch (err) {
        console.log("Backend-auth.middleware.js-verifyToken error: ", err);
        res.status(401).json({ error: "Invalid token" });
    }
}
