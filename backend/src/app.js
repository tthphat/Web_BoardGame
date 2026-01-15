import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.use(errorHandler);

export default app;