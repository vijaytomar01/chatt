import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const from = req.user._id;
    const { id: to } = req.params;

    if (from.equals(to)) return res.status(400).json({ message: "Cannot send friend request to yourself." });

    // already friends?
    const sender = await User.findById(from);
    if (sender.friends && sender.friends.includes(to)) {
      return res.status(400).json({ message: "You are already friends." });
    }

    // existing pending request
    const existing = await FriendRequest.findOne({ from, to, status: "pending" });
    if (existing) return res.status(400).json({ message: "Friend request already sent." });

    const fr = new FriendRequest({ from, to });
    await fr.save();

    res.status(201).json(fr);
  } catch (error) {
    console.error("sendFriendRequest error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await FriendRequest.find({ to: userId, status: "pending" }).populate("from", "fullName email profilePic");
    res.status(200).json(requests);
  } catch (error) {
    console.error("getIncomingRequests error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: fromId } = req.params; // who sent the request

    const fr = await FriendRequest.findOne({ from: fromId, to: userId, status: "pending" });
    if (!fr) return res.status(404).json({ message: "Friend request not found." });

    fr.status = "accepted";
    await fr.save();

    // add each other as friends (if not already)
    await User.findByIdAndUpdate(userId, { $addToSet: { friends: fromId } });
    await User.findByIdAndUpdate(fromId, { $addToSet: { friends: userId } });

    res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    console.error("acceptFriendRequest error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: fromId } = req.params;

    const fr = await FriendRequest.findOne({ from: fromId, to: userId, status: "pending" });
    if (!fr) return res.status(404).json({ message: "Friend request not found." });

    fr.status = "rejected";
    await fr.save();

    res.status(200).json({ message: "Friend request rejected." });
  } catch (error) {
    console.error("rejectFriendRequest error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
