import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme.chatItemBg.split(' ')[0]}`}>
        <MessageCircleIcon className={`w-8 h-8 ${theme.accent.replace('-500', '-400')}`} />
      </div>
      <div>
        <h4 className={`font-medium mb-1 ${theme.text}`}>No conversations yet</h4>
        <p className={`text-sm px-6 ${theme.text} opacity-60`}>
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className={`px-4 py-2 text-sm rounded-lg transition-colors ${theme.chatItemBg}`}
      >
        Find contacts
      </button>
    </div>
  );
}
export default NoChatsFound;
