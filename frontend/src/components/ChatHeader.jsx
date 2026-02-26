import { XIcon, Phone, Video } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader({ onAudioCall, onVideoCall }) {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { getTheme } = useThemeStore();
  const theme = getTheme();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className={`flex justify-between items-center ${theme.headerBg} border-b ${theme.borderColor} max-h-[84px] px-6 flex-1`}
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        <div>
          <h3 className={`${theme.text} font-medium`}>{selectedUser.fullName}</h3>
          <p className={`text-sm opacity-60 ${theme.text}`}>{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onAudioCall && onAudioCall()}
          disabled={!isOnline}
          className={`p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 ${theme.buttonSecondary.split(' ')[0]}`}
          title="Start audio call"
        >
          <Phone className="w-5 h-5" />
        </button>

        <button
          onClick={() => onVideoCall && onVideoCall()}
          disabled={!isOnline}
          className={`p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 ${theme.buttonSecondary.split(' ')[0]}`}
          title="Start video call"
        >
          <Video className="w-5 h-5" />
        </button>

        <button onClick={() => setSelectedUser(null)} className={`p-2 transition-colors ${theme.iconButton}`} title="Close">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
export default ChatHeader;
