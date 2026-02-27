import express from "express";
import dotenv, { parse } from "dotenv";
import cors from "cors";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRout.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:8081', 'exp://192.168.1.100:8081', '*'], // Allow Expo development origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

if (process.env.NODE_ENV === "production") job.start();

app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("server is up running on the PORT:", PORT);
  });
});
