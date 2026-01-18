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

// ...

app.use(checkApiKey); // middleware kiểm tra api key

app.use("/api/admin", verifyToken, adminRoute); // Register admin route
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