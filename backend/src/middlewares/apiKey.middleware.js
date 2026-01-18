import dotenv from "dotenv";
dotenv.config();

export function checkApiKey(req, res, next) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(401).json({
            message: "Missing x-api-key"
        });
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({
            message: "Invalid API key"
        });
    }

    next();
}
