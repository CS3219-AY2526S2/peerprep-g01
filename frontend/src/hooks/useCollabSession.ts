import { type OnMount } from "@monaco-editor/react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import type Question from "../types/question";

const COLLAB_URL = "http://localhost:3004";

export type PartnerStatus = "waiting" | "connected" | "disconnected" | "left";

export interface UseCollabSessionReturn {
  question: Question | null;
  partnerStatus: PartnerStatus;
  language: string;
  setLanguage: (lang: string) => void;
  handleEditorMount: OnMount;
  handleLeave: () => void;
}

function UseCollabSession(): UseCollabSessionReturn {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const { token } = useAuthStore();

  const socketRef = useRef<Socket | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

  const [question, setQuestion] = useState<Question | null>(null);
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus>("waiting");
  const [language, setLanguage] = useState("javascript");

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
    socket.on("question", (data: Question) => {
      setQuestion(data);
    });

    socket.on("yjs-state", (state: Uint8Array) => {
      Y.applyUpdate(ydoc, state);
    });

    socket.on("yjs-update", (update: Uint8Array) => {
      Y.applyUpdate(ydoc, update, "remote");
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
  };
}

export default UseCollabSession;
