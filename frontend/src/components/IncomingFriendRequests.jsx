import { useEffect } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { useThemeStore } from "../store/useThemeStore";
import { Check, X, AlertCircle } from "lucide-react";

function IncomingFriendRequests() {
  const { incomingRequests, getIncomingRequests, acceptFriendRequest, rejectFriendRequest, isLoadingRequests } =
    useFriendStore();
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  useEffect(() => {
    getIncomingRequests();
  }, [getIncomingRequests]);

  if (isLoadingRequests) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          <div className={`h-12 rounded-lg ${theme.bg}`}></div>
          <div className={`h-12 rounded-lg ${theme.bg}`}></div>
        </div>
      </div>
    );
  }

  if (!incomingRequests || incomingRequests.length === 0) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className={`w-12 h-12 mx-auto mb-3 opacity-50 ${theme.text}`} />
        <p className={`text-sm ${theme.text} opacity-60`}>No pending friend requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      <h3 className={`font-semibold text-sm mb-4 ${theme.text}`}>
        Friend Requests ({incomingRequests.length})
      </h3>
      {incomingRequests.map((request) => (
        <div key={request._id} className={`p-4 rounded-lg flex items-center justify-between gap-2 ${theme.chatItemBg}`}>
          <div className="flex items-center gap-3 flex-1">
            <img
              src={request.from.profilePic || "/avatar.png"}
              alt={request.from.fullName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${theme.text}`}>{request.from.fullName}</p>
              <p className={`text-xs truncate ${theme.text} opacity-60`}>{request.from.email}</p>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => acceptFriendRequest(request.from._id)}
              className={`p-2 rounded-full transition-colors ${theme.buttonPrimary}`}
              title="Accept"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => rejectFriendRequest(request.from._id)}
              className={`p-2 rounded-full transition-colors ${theme.buttonSecondary}`}
              title="Reject"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default IncomingFriendRequests;
