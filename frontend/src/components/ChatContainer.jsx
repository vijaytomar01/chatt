import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import ChatHeader from "./ChatHeader";
import CallInterface from "./CallInterface";
import IncomingCallModal from "./IncomingCallModal";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import toast from "react-hot-toast";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const { getTheme } = useThemeStore();
  const theme = getTheme();
  const messageEndRef = useRef(null);

  // Call state
  const [activeCall, setActiveCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callType, setCallType] = useState(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  // Handle incoming calls
  useEffect(() => {
    if (!socket) {
      console.log("Socket not available yet");
      return;
    }

    console.log("Setting up call event listeners");

    const handleIncomingCall = ({ callerId, callerName, callType }) => {
      console.log("Incoming call from:", callerName, callType);
      setIncomingCall({ callerId, callerName, callType });
      toast.success(`${callerName} is calling you...`);
    };

    const handleCallAnswered = () => {
      console.log("Call answered");
      toast.dismiss();
      toast.success("Call connected");
    };

    const handleCallRejected = () => {
      console.log("Call rejected");
      toast.dismiss();
      toast.error("Call was rejected");
      setActiveCall(null);
    };

    const handleCallEnded = () => {
      console.log("Call ended");
      toast.dismiss();
      setActiveCall(null);
    };

    const handleCallError = ({ message }) => {
      console.error("Call error:", message);
      toast.dismiss();
      toast.error(message || "Call failed");
      setActiveCall(null);
    };

    socket.on("incomingCall", handleIncomingCall);
    socket.on("callAnswered", handleCallAnswered);
    socket.on("callRejected", handleCallRejected);
    socket.on("callEnded", handleCallEnded);
    socket.on("callError", handleCallError);

    return () => {
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callAnswered", handleCallAnswered);
      socket.off("callRejected", handleCallRejected);
      socket.off("callEnded", handleCallEnded);
      socket.off("callError", handleCallError);
    };
  }, [socket]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const initiateCall = (type) => {
    if (!socket) {
      toast.error("Socket not connected");
      console.error("Socket not available");
      return;
    }
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    console.log(`Initiating ${type} call with ${selectedUser.fullName}`);
    socket.emit("initiateCall", { recipientId: selectedUser._id, callType: type });
    setActiveCall({ recipientId: selectedUser._id, callType: type });
    setCallType(type);
    toast.loading(`Calling ${selectedUser.fullName}...`);
  };

  const handleAcceptCall = () => {
    if (!socket) return;
    socket.emit("answerCall", { callerId: incomingCall.callerId });
    setActiveCall({ recipientId: incomingCall.callerId, callType: incomingCall.callType });
    setCallType(incomingCall.callType);
    setIncomingCall(null);
  };

  const handleRejectCall = () => {
    if (!socket) return;
    socket.emit("rejectCall", { callerId: incomingCall.callerId });
    setIncomingCall(null);
  };

  const handleEndCall = () => {
    setActiveCall(null);
    setCallType(null);
  };

  return (
    <>
      {activeCall && (
        <CallInterface
          remoteUserId={activeCall.recipientId}
          remoteUserName={selectedUser.fullName}
          callType={callType}
          onEndCall={handleEndCall}
        />
      )}

      {incomingCall && (
        <IncomingCallModal
          callerName={incomingCall.callerName}
          callType={incomingCall.callType}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      <ChatHeader onAudioCall={() => initiateCall("audio")} onVideoCall={() => initiateCall("video")} />
      <div className={`flex-1 px-6 overflow-y-auto py-8 ${theme.bg}`}>
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? theme.chatBubbleSent + " text-white"
                      : theme.chatBubbleReceived + " " + theme.text
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {/* 👇 scroll target */}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
