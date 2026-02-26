import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useFriendStore = create((set, get) => ({
  incomingRequests: [],
  outgoingRequests: [],
  friends: [],
  userFriends: [], // Current user's friends list
  isLoadingRequests: false,
  isLoadingFriends: false,

  getIncomingRequests: async () => {
    set({ isLoadingRequests: true });
    try {
      const res = await axiosInstance.get("/friends/requests");
      set({ incomingRequests: res.data });
    } catch (error) {
      console.error("Error loading requests:", error);
      // Don't show error toast if it's a 404 (endpoint might not exist yet)
    } finally {
      set({ isLoadingRequests: false });
    }
  },

  sendFriendRequest: async (recipientId) => {
    try {
      const res = await axiosInstance.post(`/friends/request/${recipientId}`);
      // Add to outgoing requests
      set({ outgoingRequests: [...get().outgoingRequests, res.data] });
      toast.success("Friend request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  acceptFriendRequest: async (senderId) => {
    try {
      await axiosInstance.post(`/friends/accept/${senderId}`);
      // Remove from incoming and add to friends
      set({
        incomingRequests: get().incomingRequests.filter((r) => r.from._id !== senderId),
        userFriends: [...get().userFriends, senderId],
      });
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  },

  rejectFriendRequest: async (senderId) => {
    try {
      await axiosInstance.post(`/friends/reject/${senderId}`);
      // Remove from incoming
      set({
        incomingRequests: get().incomingRequests.filter((r) => r.from._id !== senderId),
      });
      toast.success("Friend request rejected");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  },

  // Initialize friend store with current user's data
  initializeFriends: (userFriends = []) => {
    set({ userFriends });
  },
}));
