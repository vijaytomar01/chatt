import { Phone, PhoneOff } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

function IncomingCallModal({ callerName, callType, onAccept, onReject }) {
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className={`rounded-lg p-8 text-center max-w-sm ${theme.bg} ${theme.borderColor}`}
      >
        <div className="mb-6">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white ${theme.accent}`}>
            {callerName?.charAt(0).toUpperCase()}
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${theme.text}`}>{callerName}</h2>
          <p className={`${theme.text} opacity-70`}>
            Incoming {callType === "video" ? "Video" : "Audio"} Call
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onReject}
            className={`p-4 rounded-full transition-all ${theme.buttonSecondary}`}
            title="Reject call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={onAccept}
            className={`p-4 rounded-full transition-all ${theme.buttonPrimary}`}
            title="Accept call"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCallModal;
