import { useThemeStore } from "../store/useThemeStore";

function MessagesLoadingSkeleton() {
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse`}
        >
          <div className={`chat-bubble text-white w-32 ${index % 2 === 0 ? theme.chatBubbleReceived : theme.chatBubbleSent}`}></div>
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;
