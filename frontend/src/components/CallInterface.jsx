import { useState, useEffect } from "react";
import { Phone, PhoneOff, Video, Mic, MicOff } from "lucide-react";
import useWebRTC from "../hooks/useWebRTC";
import { useThemeStore } from "../store/useThemeStore";

function CallInterface({ remoteUserId, remoteUserName, callType, onEndCall }) {
  const { localVideoRef, remoteVideoRef, createOffer, endCall, localStream } = useWebRTC(remoteUserId, callType);
  const { getTheme } = useThemeStore();
  const theme = getTheme();
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    console.log("CallInterface mounted, initiating call...");
    createOffer();
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, [createOffer]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted; // if isMuted is true, we enable tracks (unmute)
      });
      setIsMuted(!isMuted);
    }
  };

  const handleEndCall = () => {
    endCall();
    onEndCall();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${theme.bg}`}>
      <div className="w-full h-full flex flex-col">
        {/* Remote video (larger) */}
        <div className="flex-1 bg-black relative">
          {callType === "video" ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white ${theme.accent}`}> 
                  {remoteUserName?.charAt(0).toUpperCase()}
                </div>
                <p className={`text-xl font-medium ${theme.text}`}>{remoteUserName}</p>
              </div>
            </div>
          )}

          {/* Local video (PiP) */}
          {callType === "video" && (
            <div className={`absolute bottom-4 right-4 w-32 h-32 bg-black border-2 rounded-lg overflow-hidden ${theme.accent}`}>
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            </div>
          )}

          {/* Call duration */}
          <div className={`absolute top-6 left-6 px-4 py-2 rounded-lg ${theme.borderColor} bg-opacity-80`}> 
            <p className={`font-semibold text-lg ${theme.text}`}>{formatTime(callDuration)}</p>
          </div>
        </div>

        {/* Call controls */}
        <div className={`flex items-center justify-center gap-6 p-6 ${theme.headerBg} ${theme.borderColor}`}> 
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-all ${
              isMuted
                ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                : `${theme.iconButton}`
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            onClick={handleEndCall}
            className={`p-4 rounded-full text-white hover:opacity-80 transition-all ${theme.buttonSecondary}`}
            title="End call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {callType === "video" && (
            <button
              className={`p-4 rounded-full transition-all hover:opacity-80 ${theme.iconButton}`}
              title="Camera"
            >
              <Video className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CallInterface;
