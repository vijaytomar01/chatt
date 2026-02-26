import { MessageCircleIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const NoConversationPlaceholder = () => {
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className={`size-20 rounded-full flex items-center justify-center mb-6 ${theme.chatItemBg.split(' ')[0]} opacity-30`}>
        <MessageCircleIcon className={`size-10 ${theme.accent.replace('-500', '-400')}`} />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${theme.text}`}>Select a conversation</h3>
      <p className={`max-w-md ${theme.text} opacity-60`}>
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;
