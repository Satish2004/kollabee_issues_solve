import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import prisma from "./db/index";
import { setupRoutes } from "./routes";
import { Server } from "socket.io";
import { handleSocketConnection } from "./sockets";

const app: Application = express();

// Basic middleware
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming request from:", origin);
      const allowedOrigins = [
        "https://kollabee-theta.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
         // For local testing
      ];
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Static file serving
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Rate limiting
const limiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Setup all routes
setupRoutes(app);

// Start server
  const port = process.env.PORT || 2000;

  // Create an HTTP server using app.listen()
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Initialize Socket.IO and attach it to the server
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Set up Socket.io connection handler
  io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);
    handleSocketConnection(socket, io, prisma);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  prisma.$disconnect();
  process.exit(0);
});
