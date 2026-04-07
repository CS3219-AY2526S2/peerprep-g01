import { useEffect, useRef, useState } from "react";
import useAuthStore from "../store/authStore";
import type User from "../types/user";
import type Topic from "../types/topic";
import { fetchTopics } from "../services/questionService";
import {
  joinMatchQueue as joinMatchQueueRequest,
  leaveMatchQueue as leaveMatchQueueRequest,
  getMatchStatus as getMatchStatusRequest,
} from "../services/matchService";
import { useNavigate } from "react-router-dom";

type MatchState = "idle" | "waiting" | "matched" | "timeout";

export interface MatchResult {
  sessionId: string;
  matchedUserId: string;
  roomId: string;
  question: {
    title?: string;
    difficulty?: string;
    topic?: string;
  } | null;
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

const POLL_INTERVAL = 2000; // ms

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

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startPolling() {
    pollingRef.current = setInterval(async () => {
      try {
        const status = await getMatchStatusRequest();
        if (status.status === "matched") {
          stopPolling();
          stopTimer();
          setMatchResult({
            sessionId: status.sessionId,
            matchedUserId: status.matchedUserId,
            roomId: status.roomId,
            question: status.question ?? null,
          });
          setMatchState("matched");
        } else if (status.status === "timeout") {
          stopPolling();
          stopTimer();
          setMatchState("timeout");
        }
      } catch (err) {
        console.error("polling error:", err);
      }
    }, POLL_INTERVAL);
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
      stopPolling();
      stopTimer();
    };
  }, []);

  async function handleMatchRequest() {
    if (!selectedTopic || !selectedDifficulty) return;
    try {
      await joinMatchQueueRequest(selectedTopic.topicId, selectedDifficulty);
      setMatchState("waiting");
      setMatchResult(null);
      startTimer();
      startPolling();
    } catch (err) {
      console.log(
        "An unexpected error occurred while attempting to load questions",
        err,
      );
    }
  }

  async function handleCancelMatch() {
    stopPolling();
    stopTimer();
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
    navigate(`/collab/${matchResult.roomId}`);
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
