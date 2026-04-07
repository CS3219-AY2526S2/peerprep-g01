import { useEffect, useRef, useState } from "react";
import useAuthStore from "../store/authStore";
import type User from "../types/user";
import type Topic from "../types/topic";
import { fetchTopics } from "../services/questionService";
import {
  joinMatchQueue as joinMatchQueueRequest,
  leaveMatchQueue as leaveMatchQueueRequest,
} from "../services/matchService";
import { useNavigate } from "react-router-dom";

type MatchState = "idle" | "waiting" | "matched" | "timeout";

export interface MatchQuestion {
  questionId: string;
  questionName: string;
  description: string;
  difficulty: string;
  topicId: number;
  topicName: string;
  publicTestCase: unknown[];
  privateTestCase: unknown[];
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  modifiedBy: string;
}

export interface MatchResult {
  sessionId: string;
  matchedUserId: string;
  roomId: string;
  question: MatchQuestion | null;
}

export interface UseMatchReturn {
  user: User | null;
  topics: Topic[];
  topicLoading: boolean;
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic | null) => void;
  selectedDifficulty: string | null;
  setSelectedDifficulty: (difficulty: string | null) => void;
  matchState: MatchState;
  matchResult: MatchResult | null;
  elapsed: number;
  handleMatchRequest: () => void;
  handleCancelMatch: () => void;
  handleEnterRoom: () => void;
}

const MATCH_TIMEOUT_MS = 30000;

function useMatch(): UseMatchReturn {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicLoading, setTopicsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    "Easy",
  );

  const [matchState, setMatchState] = useState<MatchState>("idle");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function stopTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startTimer() {
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }

  // fetch topics on mount
  useEffect(() => {
    fetchTopics()
      .then((res) => {
        const { data } = res;
        setTopics(data);
        if (data.length > 0) setSelectedTopic(data[0]);
      })
      .catch((err) => {
        console.error("fetchTopics failed:", err);
      })
      .finally(() => setTopicsLoading(false));
  }, []);

  // clean up on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopTimeout();
    };
  }, []);

  async function handleMatchRequest() {
    if (!selectedTopic || !selectedDifficulty) return;

    setMatchState("waiting");
    setMatchResult(null);
    startTimer();

    timeoutRef.current = setTimeout(() => {
      setMatchState("timeout");
      stopTimer();
    }, MATCH_TIMEOUT_MS);

    try {
      const res = await joinMatchQueueRequest(
        selectedTopic.topicId,
        selectedDifficulty,
      );
      stopTimeout();
      stopTimer();
      if (res.status === "matched") {
        setMatchResult({
          sessionId: res.sessionId,
          matchedUserId: res.matchedUserId,
          roomId: res.roomId,
          question: res.question ?? null,
        });
        setMatchState("matched");
      } else if (res.status === "timeout") {
        setMatchState("timeout");
      }
    } catch (err) {
      console.error("Failed to join match queue:", err);
      stopTimeout();
      stopTimer();
      setMatchState("idle");
    }
  }

  async function handleCancelMatch() {
    stopTimer();
    stopTimeout();
    setElapsed(0);
    setMatchState("idle");

    if (!selectedTopic || !selectedDifficulty) return;
    try {
      await leaveMatchQueueRequest(selectedTopic.topicId, selectedDifficulty);
    } catch (err) {
      console.error("Failed to cancel match:", err);
    }
  }

  function handleEnterRoom() {
    if (!matchResult?.roomId) return;
    navigate(`/session/${matchResult.roomId}`, {
      state: { question: matchResult.question },
    });
  }

  return {
    user,
    selectedTopic,
    topics,
    topicLoading,
    setSelectedTopic,
    selectedDifficulty,
    setSelectedDifficulty,
    matchState,
    matchResult,
    elapsed,
    handleMatchRequest,
    handleCancelMatch,
    handleEnterRoom,
  };
}

export default useMatch;
