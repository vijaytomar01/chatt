import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import User from "../models/User.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ===== CALLING FUNCTIONALITY =====
  socket.on("initiateCall", async ({ recipientId, callType }) => {
    try {
      console.log(`Call initiated from ${userId} to ${recipientId}, type: ${callType}`);
      
      // Check if users are friends
      const caller = await User.findById(userId);
      if (!caller.friends || !caller.friends.includes(recipientId)) {
        console.log(`Call rejected: ${userId} and ${recipientId} are not friends`);
        socket.emit("callError", { message: "You can only call accepted friends" });
        return;
      }

      const recipientSocketId = userSocketMap[recipientId];
      if (recipientSocketId) {
        console.log(`Sending incomingCall to ${recipientId}`);
        io.to(recipientSocketId).emit("incomingCall", {
          callerId: userId,
          callerName: socket.user.fullName,
          callType, // "audio" or "video"
        });
      } else {
        console.log(`Recipient ${recipientId} not online`);
        socket.emit("callError", { message: "User is offline" });
      }
    } catch (error) {
      console.error("Error in initiateCall:", error);
      socket.emit("callError", { message: "Error initiating call" });
    }
  });

  socket.on("answerCall", ({ callerId }) => {
    console.log(`Call answered by ${userId} from ${callerId}`);
    const callerSocketId = userSocketMap[callerId];
    if (callerSocketId) {
      io.to(callerSocketId).emit("callAnswered", { recipientId: userId });
    }
  });

  socket.on("rejectCall", ({ callerId }) => {
    console.log(`Call rejected by ${userId} from ${callerId}`);
    const callerSocketId = userSocketMap[callerId];
    if (callerSocketId) {
      io.to(callerSocketId).emit("callRejected", { reason: "User declined the call" });
    }
  });

  socket.on("sendOffer", ({ recipientId, offer }) => {
    console.log(`Offer sent from ${userId} to ${recipientId}`);
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveOffer", { offer, callerId: userId });
    }
  });

  socket.on("sendAnswer", ({ recipientId, answer }) => {
    console.log(`Answer sent from ${userId} to ${recipientId}`);
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveAnswer", { answer });
    }
  });

  socket.on("sendIceCandidate", ({ recipientId, candidate }) => {
    console.log(`ICE candidate sent from ${userId} to ${recipientId}`);
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveIceCandidate", { candidate });
    }
  });

  socket.on("endCall", ({ recipientId }) => {
    console.log(`Call ended by ${userId} with ${recipientId}`);
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("callEnded");
    }
  });

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
