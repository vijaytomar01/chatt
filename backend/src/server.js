import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import fs from "fs";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import friendRoutes from "./routes/friend.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

// Resolve paths relative to this file (backend/src), not the process CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // req.body

// CORS: allow the configured client URL, but also handle same-origin Render deployments gracefully
const allowedOrigins = [ENV.CLIENT_URL].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no origin), or any explicitly allowed origin
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Fallback: in hosted environments like Render, allow the app's own origin
      try {
        const url = new URL(origin);
        if (ENV.CLIENT_URL && new URL(ENV.CLIENT_URL).host === url.host) {
          return callback(null, true);
        }
      } catch {
        // ignore malformed origins
      }

      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friends", friendRoutes);

// make ready for deployment
const isProdLike = ENV.NODE_ENV === "production" || Boolean(process.env.RENDER);

if (isProdLike) {
  // backend/src -> backend -> project root -> frontend/dist
  const distPath = path.join(__dirname, "../../frontend/dist");

  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    app.get("*", (_, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.warn(
      `Frontend dist not found at ${distPath}. Did you run the frontend build (npm run build)?`
    );
  }
}

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
