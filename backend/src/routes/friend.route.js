import express from "express";
import { sendFriendRequest, getIncomingRequests, acceptFriendRequest, rejectFriendRequest } from "../controllers/friend.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);

router.post("/request/:id", sendFriendRequest);
router.get("/requests", getIncomingRequests);
router.post("/accept/:id", acceptFriendRequest);
router.post("/reject/:id", rejectFriendRequest);

export default router;
