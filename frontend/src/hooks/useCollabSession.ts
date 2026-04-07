import { type OnMount } from "@monaco-editor/react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { useLocation } from "react-router-dom";
import type { MatchQuestion } from "./useMatch";

const COLLAB_URL = "http://localhost:3004";

export type PartnerStatus = "waiting" | "connected" | "disconnected" | "left";

export interface UseCollabSessionReturn {
  question: MatchQuestion | null;
  partnerStatus: PartnerStatus;
  language: string;
  setLanguage: (lang: string) => void;
  handleEditorMount: OnMount;
  handleLeave: () => void;
  leaveDialogOpen: boolean;
  setLeaveDialogOpen: (status: boolean) => void;
}

function useCollabSession(): UseCollabSessionReturn {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuthStore();

  const socketRef = useRef<Socket | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

  const [question, setQuestion] = useState<MatchQuestion | null>(
    location.state?.question ?? null,
  );
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus>("waiting");
  const [language, setLanguage] = useState("javascript");

  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    // 1. Create Yjs doc
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // 2. Connect to collab service
    const socket = io(COLLAB_URL, {
      auth: { token },
      query: { roomId },
    });
    socketRef.current = socket;

    // 3. Server → client events
    socket.on("question", (data: MatchQuestion) => {
      setQuestion((prev) => prev ?? data);
    });

    socket.on("yjs-state", (state: unknown) => {
      Y.applyUpdate(ydoc, new Uint8Array(state as ArrayBuffer));
    });

    socket.on("yjs-update", (update: unknown) => {
      Y.applyUpdate(ydoc, new Uint8Array(update as ArrayBuffer), "remote");
    });

    socket.on("partner_joined", () => setPartnerStatus("connected"));
    socket.on("partner_disconnected", () => setPartnerStatus("disconnected"));
    socket.on("partner_left", () => setPartnerStatus("left"));

    socket.on("connect_error", (err) => {
      console.error("Collab socket connection error:", err.message);
    });

    // 4. Local Yjs changes → emit to server
    ydoc.on("update", (update: Uint8Array, origin: unknown) => {
      if (origin === "remote") return;
      socket.emit("yjs-update", update);
    });

    // 5. Cleanup
    return () => {
      bindingRef.current?.destroy();
      bindingRef.current = null;
      ydoc.destroy();
      ydocRef.current = null;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, roomId]);

  const handleEditorMount: OnMount = function (editor) {
    if (!ydocRef.current) return;
    const ytext = ydocRef.current.getText("code");
    bindingRef.current = new MonacoBinding(
      ytext,
      editor.getModel()!,
      new Set([editor]),
    );
  };

  function handleLeave() {
    socketRef.current?.emit("leave_session");
    navigate("/home");
  }

  return {
    question,
    partnerStatus,
    language,
    setLanguage,
    handleEditorMount,
    handleLeave,
    leaveDialogOpen,
    setLeaveDialogOpen,
  };
}

export default useCollabSession;
