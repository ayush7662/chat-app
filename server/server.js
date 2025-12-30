import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// ✅ Initialize socket.io
export const io = new Server(server, {
  cors: { origin: "*" },
});

// ✅ Map to track online users
export const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ✅ Middlewares
app.use(express.json({ limit: "4mb" }));
app.use(cors());



// ✅ API routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// ✅ Catch-all route for debugging 404s (must be last)
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        success: false, 
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        availableRoutes: [
            "POST /api/auth/signup",
            "POST /api/auth/login",
            "GET /api/auth/check",
            "PUT /api/auth/update-profile"
        ]
    });
});

// ✅ Connect to DB and start server
await connectDB();

const PORT = 5002;
server.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
