import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import AllUsersWithAddFriend from "../components/AllUsersWithAddFriend";
import IncomingFriendRequests from "../components/IncomingFriendRequests";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ThemeSwitcher from "../components/ThemeSwitcher";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  return (
    <div className={`relative w-full max-w-6xl h-[800px] ${theme.bg}`}>
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className={`w-80 ${theme.sidebarBg} backdrop-blur-sm flex flex-col`}>
          <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
            <h1 className={`font-bold text-xl ${theme.text}`}>Chatify</h1>
            <ThemeSwitcher />
          </div>
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" && <ChatsList />}
            {activeTab === "contacts" && <AllUsersWithAddFriend />}
            {activeTab === "requests" && <IncomingFriendRequests />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={`flex-1 flex flex-col ${theme.headerBg} backdrop-blur-sm`}>
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
