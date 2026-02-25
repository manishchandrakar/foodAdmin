import "dotenv/config";
import "express-async-errors"; // patches Express 4 to forward async errors to the error handler
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import routes from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

// ─── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000 " || "http://localhost:3001")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} is not allowed`));
      }
    },
    credentials: true,
  })
);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Static Files (uploads) ──────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api", routes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT,"0.0.0.0", () => {
  console.log(`[server] FoodAdmin API running on http://localhost:${PORT}`);
});

export default app;
