import express from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import achievementRoute from "./routes/achievement.route.js";
import gameRoute from "./routes/game.route.js";

import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js"; // Import route

import { checkApiKey } from "./middlewares/apiKey.middleware.js";
import { verifyToken } from "./middlewares/auth.middleware.js";
import { GameController } from "./controllers/game.controller.js";
import { authorize } from "./middlewares/authorize.middleware.js";

import { swaggerLoginView, swaggerLoginAction, swaggerProtect } from "./middlewares/swaggerAuth.middleware.js";

const app = express();

// Parse urlencoded (form data) for login docs
app.use(express.urlencoded({ extended: true }));

// CORS configuration - allow multiple origins
const allowedOrigins = [
    "https://web-board-game-phi.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ===== Swagger Login (Public) =====
app.get('/docs-login', swaggerLoginView);
app.post('/docs-login', swaggerLoginAction);

// ===== Swagger Documentation (Protected - requires Cookie Auth) =====
app.use("/api-docs", swaggerProtect, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Public routes (no auth or api key required)
app.use("/api/auth", authRoute); // login, register
app.get("/api/games/enabled", GameController.getEnabledGames); // enabled games list

app.get("api/games/board-configs", GameController.getBoardConfigs);

// Apply API key check for all routes below
app.use(checkApiKey);

// Protected routes (Require Auth)
app.get("/api/games/leaderboard", verifyToken, GameController.getAllLeaderboards); // ranking for each game
app.get("/api/games/:slug/leaderboard", verifyToken, GameController.getLeaderboard); // specific game ranking

app.use("/api/admin", verifyToken, authorize("admin"), adminRoute); // Register admin route

app.use("/api/achievements", verifyToken, achievementRoute);
app.use("/api/games", verifyToken, gameRoute);
app.use("/api/user", verifyToken, userRoute);

// app.use("/api-docs", ... ) moved up

app.use(errorHandler);

app.get('/', (req, res) => {
    res.json({ message: "Hello World" });
});

export default app;