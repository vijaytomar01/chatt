import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab ${
          activeTab === "chats" ? theme.tabActive : theme.tabInactive
        }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab ${
          activeTab === "contacts" ? theme.tabActive : theme.tabInactive
        }`}
      >
        Contacts
      </button>

      <button
        onClick={() => setActiveTab("requests")}
        className={`tab ${
          activeTab === "requests" ? theme.tabActive : theme.tabInactive
        }`}
      >
        Requests
      </button>
    </div>
  );
}
export default ActiveTabSwitch;
