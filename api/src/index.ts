import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import prisma from "./db/index";
import { setupRoutes } from "./routes";
import "dotenv/config";
import fs from "fs";

const app = express();

// Basic middleware

console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:3000",
  "https://kollabee-theta.vercel.app/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// In your auth middleware
app.use((req: any, res: any, next: any) => {
  console.log("Incoming request from:", req.headers.origin);
  console.log("Cookies received:", req.cookies);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to be served
  })
);
app.use(compression());
app.use(morgan("dev"));

// Static file serving
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  }
);

// Setup all routes
setupRoutes(app);

// Export for Vercel
export default app;

let port: string | number | undefined;
// Start server only if not in Vercel
if (process.env.NODE_ENV == "production") {
  port = process.env.PORT;
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  prisma.$disconnect();
  process.exit(0);
});
