import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import prisma from "./db"; // adjust if needed
import { setupRoutes } from "./routes";
import { handleSocketConnection } from "./sockets";

// Load env variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS setup
app.use(
  cors({
    origin: [
      "https://kollabee-theta.vercel.app",
      "https://kollabee-frontend.onrender.com",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Rate limiter
app.use(
  rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 100,
  })
);

// API routes
setupRoutes(app);

// Serve static Next.js export build
const staticPath = path.join(__dirname, "frontend");
app.use(express.static(staticPath));

// Catch-all to serve index.html for any unmatched route (for client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

// WebSockets
const io = new Server(server, {
  cors: {
    origin: [
      "https://kollabee-theta.vercel.app",
      "https://kollabee-frontend.onrender.com",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
  handleSocketConnection(socket, io, prisma);
});

// Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing server.");
  prisma.$disconnect();
  process.exit(0);
});
