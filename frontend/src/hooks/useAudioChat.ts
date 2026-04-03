import { useEffect, useRef, useState, useCallback } from "react";
import type { Socket } from "socket.io-client";

interface UseAudioChatProps {
  socket: Socket | null;
  myUserId: string;
  isUserOne: boolean;
  roomId: string;
}

interface UseAudioChatReturn {
  micOn: boolean;
  partnerMicOn: boolean;
  audioConnected: boolean;
  toggleMic: () => Promise<void>;
  cleanup: () => void;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export default function useAudioChat({
  socket,
  myUserId,
  isUserOne,
}: UseAudioChatProps): UseAudioChatReturn {
  const [micOn, setMicOn] = useState(false);
  const [partnerMicOn, setPartnerMicOn] = useState(false);
  const [audioConnected, setAudioConnected] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const partnerReadyRef = useRef(false);

  const createPeerConnection = useCallback(() => {
    if (!socket || !localStreamRef.current) return null;

    const pc = new RTCPeerConnection(ICE_SERVERS);

    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });

    pc.ontrack = (event) => {
      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.play().catch(() => {});
      remoteAudioRef.current = audio;
      setAudioConnected(true);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate });
      }
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [socket]);

  const createOffer = useCallback(async () => {
    const pc = createPeerConnection();
    if (!pc) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket!.emit("audio-offer", { offer });
  }, [socket, createPeerConnection]);

  const cleanup = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.pause();
      remoteAudioRef.current.srcObject = null;
      remoteAudioRef.current = null;
    }
    partnerReadyRef.current = false;
    setMicOn(false);
    setPartnerMicOn(false);
    setAudioConnected(false);
  }, []);

  const toggleMic = useCallback(async () => {
    if (!socket) return;

    if (!localStreamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStreamRef.current = stream;
        setMicOn(true);
        socket.emit("audio-ready");

        if (partnerReadyRef.current && isUserOne) {
          await createOffer();
        }
      } catch (err) {
        console.error("[audio] Mic permission denied:", err);
      }
      return;
    }

    const track = localStreamRef.current.getAudioTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    setMicOn(track.enabled);
    socket.emit(track.enabled ? "audio-unmuted" : "audio-muted");
  }, [socket, isUserOne, createOffer]);

  useEffect(() => {
    if (!socket) return;

    const onPartnerReady = async () => {
      partnerReadyRef.current = true;
      setPartnerMicOn(true);

      if (isUserOne && localStreamRef.current && !peerConnectionRef.current) {
        await createOffer();
      }
    };

    const onAudioOffer = async (data: { offer: RTCSessionDescriptionInit }) => {
      const pc = createPeerConnection();
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("audio-answer", { answer });
    };

    const onAudioAnswer = async (data: {
      answer: RTCSessionDescriptionInit;
    }) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.answer),
      );
    };

    const onIceCandidate = async (data: {
      candidate: RTCIceCandidateInit;
    }) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(data.candidate),
      );
    };

    const onPartnerMuted = () => setPartnerMicOn(false);
    const onPartnerUnmuted = () => setPartnerMicOn(true);

    const onPartnerAudioStopped = () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.pause();
        remoteAudioRef.current.srcObject = null;
        remoteAudioRef.current = null;
      }
      partnerReadyRef.current = false;
      setPartnerMicOn(false);
      setAudioConnected(false);
    };

    socket.on("partner-audio-ready", onPartnerReady);
    socket.on("audio-offer", onAudioOffer);
    socket.on("audio-answer", onAudioAnswer);
    socket.on("ice-candidate", onIceCandidate);
    socket.on("partner-audio-muted", onPartnerMuted);
    socket.on("partner-audio-unmuted", onPartnerUnmuted);
    socket.on("partner-audio-stopped", onPartnerAudioStopped);

    return () => {
      socket.off("partner-audio-ready", onPartnerReady);
      socket.off("audio-offer", onAudioOffer);
      socket.off("audio-answer", onAudioAnswer);
      socket.off("ice-candidate", onIceCandidate);
      socket.off("partner-audio-muted", onPartnerMuted);
      socket.off("partner-audio-unmuted", onPartnerUnmuted);
      socket.off("partner-audio-stopped", onPartnerAudioStopped);
      cleanup();
    };
  }, [socket, isUserOne, createOffer, createPeerConnection, cleanup]);

  return { micOn, partnerMicOn, audioConnected, toggleMic, cleanup };
}
