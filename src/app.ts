import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import userRoutes from "./routes/user.routes";
import { apiLimiter } from "./middleware/rateLimiter";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/users", apiLimiter, userRoutes);

app.get("/", (req, res) => {
  res.send("Users API is running!");
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(400).json({ error: err.message || "Unknown error" });
});

export default app;
