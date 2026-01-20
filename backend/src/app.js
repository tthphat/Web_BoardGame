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

const app = express();

// app.use(cors());
app.use(cors({
    origin: "https://web-board-game-phi.vercel.app",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Public routes (no auth or api key required)
app.use("/api/auth", authRoute); // login, register
app.get("/api/games/enabled", GameController.getEnabledGames); // enabled games list

app.use(checkApiKey); // middleware kiểm tra api key


// Protected routes (Require Auth)
app.get("/api/games/leaderboard", verifyToken, GameController.getAllLeaderboards); // ranking for each game
app.get("/api/games/:slug/leaderboard", verifyToken, GameController.getLeaderboard); // specific game ranking

app.use("/api/admin", verifyToken, authorize("admin"), adminRoute); // Register admin route

app.use("/api/achievements", verifyToken, achievementRoute);
app.use("/api/games", verifyToken, gameRoute);
app.use("/api/user", verifyToken, userRoute);

app.use(errorHandler);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     description: Returns a simple message to verify the server is running
 *     responses:
 *       200:
 *         description: Server is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World
 */
app.get('/', (req, res) => {
    res.json({ message: "Hello World" });
});

export default app;