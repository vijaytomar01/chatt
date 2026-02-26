import { MessageCircleIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const NoChatHistoryPlaceholder = ({ name }) => {
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${theme.chatItemBg.split(' ')[0]} opacity-30`}>
        <MessageCircleIcon className={`size-8 ${theme.accent.replace('-500', '-400')}`} />
      </div>
      <h3 className={`text-lg font-medium mb-3 ${theme.text}`}>
        Start your conversation with {name}
      </h3>
      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className={`text-sm ${theme.text} opacity-60`}>
          This is the beginning of your conversation. Send a message to start chatting!
        </p>
        <div className={`h-px w-32 mx-auto ${theme.borderColor}`}></div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${theme.chatItemBg}`}>
          👋 Say Hello
        </button>
        <button className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${theme.chatItemBg}`}>
          🤝 How are you?
        </button>
        <button className={`px-4 py-2 text-xs font-medium rounded-full transition-colors ${theme.chatItemBg}`}>
          📅 Meet up soon?
        </button>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
