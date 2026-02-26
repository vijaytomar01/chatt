import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { UserPlus, UserCheck, MessageCircle } from "lucide-react";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

function AllUsersWithAddFriend() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { sendFriendRequest, outgoingRequests, getIncomingRequests } = useFriendStore();
  const { authUser } = useAuthStore();
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  useEffect(() => {
    getAllContacts();
    getIncomingRequests();
  }, [getAllContacts, getIncomingRequests]);

  // Check if a user is a friend (from authUser.friends)
  const isFriend = (userId) => {
    if (!authUser?.friends) return false;
    return authUser.friends.some((f) => (typeof f === "string" ? f === userId : f._id === userId));
  };

  const hasPendingRequest = (userId) =>
    outgoingRequests.some((r) => (typeof r.to === "string" ? r.to === userId : r.to._id === userId));

  const handleAddFriend = (userId) => {
    sendFriendRequest(userId);
  };

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.length === 0 ? (
        <div className={`p-4 text-center text-sm ${theme.text} opacity-60`}>No users available</div>
      ) : (
        allContacts.map((contact) => (
          <div key={contact._id} className={`p-4 rounded-lg transition-colors ${theme.chatItemBg}`}>
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-3 flex-1 cursor-pointer"
                onClick={() => isFriend(contact._id) && setSelectedUser(contact)}
              >
                <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
                  <div className="size-12 rounded-full">
                    <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium truncate ${theme.text}`}>{contact.fullName}</h4>
                  <p className="text-opacity-60 text-xs truncate">{contact.email}</p>
                </div>
              </div>

              <div className="flex gap-2 ml-2">
                {isFriend(contact._id) ? (
                  <>
                    <button
                      disabled
                      className={`p-2 rounded-full bg-${theme.primary}-500/20 text-${theme.primary}-400 cursor-default flex-shrink-0`}
                      title="Friend"
                    >
                      <UserCheck className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedUser(contact)}
                      className={`p-2 rounded-full text-white hover:opacity-80 transition-colors flex-shrink-0 ${theme.buttonPrimary}`}
                      title="Chat"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </>
                ) : hasPendingRequest(contact._id) ? (
                  <button
                    disabled
                    className={`p-2 rounded-full cursor-default flex-shrink-0 ${theme.iconButton}`}
                    title="Request sent"
                  >
                    <UserPlus className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddFriend(contact._id)}
                    className={`p-2 rounded-full text-white hover:opacity-80 transition-colors flex-shrink-0 ${theme.buttonPrimary}`}
                    title="Add friend"
                  >
                    <UserPlus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default AllUsersWithAddFriend;
