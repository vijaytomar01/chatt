import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const useWebRTC = (remoteUserId, callType) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const { socket } = useAuthStore();

  useEffect(() => {
    if (!socket) {
      console.error("Socket not available");
      return;
    }

    const initWebRTC = async () => {
      try {
        console.log("Initializing WebRTC...");
        // Get local media stream
        const constraints = {
          audio: true,
          video: callType === "video",
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
        localStreamRef.current = stream;

        if (localVideoRef.current && callType === "video") {
          localVideoRef.current.srcObject = stream;
        }

        // Create peer connection
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
        });

        peerConnectionRef.current = pc;

        // Add local stream tracks to peer connection
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // Handle remote stream
        pc.ontrack = (event) => {
          console.log("Remote track received:", event.track.kind);
          const remoteStream = event.streams[0];
          setRemoteStream(remoteStream);
          remoteStreamRef.current = remoteStream;
          if (remoteVideoRef.current && callType === "video") {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        };

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Sending ICE candidate");
            socket.emit("sendIceCandidate", {
              recipientId: remoteUserId,
              candidate: event.candidate,
            });
          }
        };

        pc.onconnectionstatechange = () => {
          console.log("Connection state:", pc.connectionState);
        };

        // Handle answer from remote user
        const handleReceiveAnswer = async ({ answer }) => {
          console.log("Received answer");
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
          } catch (error) {
            console.error("Error setting remote description:", error);
          }
        };

        // Handle offer from remote user (when they call back)
        const handleReceiveOffer = async ({ offer }) => {
          console.log("Received offer");
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("sendAnswer", { recipientId: remoteUserId, answer });
          } catch (error) {
            console.error("Error handling offer:", error);
          }
        };

        // Handle ICE candidates from remote
        const handleReceiveIceCandidate = async ({ candidate }) => {
          console.log("Received ICE candidate");
          try {
            if (candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        };

        // Register socket listeners
        socket.on("receiveAnswer", handleReceiveAnswer);
        socket.on("receiveOffer", handleReceiveOffer);
        socket.on("receiveIceCandidate", handleReceiveIceCandidate);

        return () => {
          // Cleanup listeners
          socket.off("receiveAnswer", handleReceiveAnswer);
          socket.off("receiveOffer", handleReceiveOffer);
          socket.off("receiveIceCandidate", handleReceiveIceCandidate);
        };
      } catch (error) {
        console.error("Error initializing WebRTC:", error);
      }
    };

    const cleanup = initWebRTC();

    return () => {
      if (cleanup) {
        cleanup.then((cleanupFn) => {
          if (typeof cleanupFn === "function") cleanupFn();
        });
      }
      // Cleanup tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [remoteUserId, callType, socket]);

  const createOffer = async () => {
    try {
      console.log("Creating offer...");
      if (peerConnectionRef.current) {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.emit("sendOffer", { recipientId: remoteUserId, offer });
        console.log("Offer sent");
      }
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const endCall = () => {
    console.log("Ending call...");
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    socket.emit("endCall", { recipientId: remoteUserId });
  };

  return {
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    createOffer,
    endCall,
  };
};

export default useWebRTC;
