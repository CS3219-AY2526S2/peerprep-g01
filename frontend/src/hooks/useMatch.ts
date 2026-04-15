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
  topicError: boolean;
  retryTopics: () => void;
  selectedTopics: Topic[];
  toggleTopic: (topic: Topic) => void;
  selectedDifficulty: string | null;
  setSelectedDifficulty: (difficulty: string | null) => void;
  matchState: MatchState;
  matchResult: MatchResult | null;
  elapsed: number;
  handleMatchRequest: () => void;
  handleCancelMatch: () => void;
  handleEnterRoom: () => void;
}

const MATCH_TIMEOUT_MS = 30 * 1000; // must match backend MATCH_TIMEOUT in matchingQueue.js

function useMatch(): UseMatchReturn {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicLoading, setTopicsLoading] = useState(true);
  const [topicError, setTopicError] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);

  function toggleTopic(topic: Topic) {
    setSelectedTopics((prev) =>
      prev.some((t) => t.topicId === topic.topicId)
        ? prev.filter((t) => t.topicId !== topic.topicId)
        : [...prev, topic],
    );
  }
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    "Easy",
  );

  const [matchState, setMatchState] = useState<MatchState>("idle");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs to always have latest values available in the unmount cleanup
  const matchStateRef = useRef(matchState);
  const selectedTopicsRef = useRef(selectedTopics);
  const selectedDifficultyRef = useRef(selectedDifficulty);
  useEffect(() => { matchStateRef.current = matchState; }, [matchState]);
  useEffect(() => { selectedTopicsRef.current = selectedTopics; }, [selectedTopics]);
  useEffect(() => { selectedDifficultyRef.current = selectedDifficulty; }, [selectedDifficulty]);

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

  function loadTopics() {
    setTopicsLoading(true);
    setTopicError(false);
    fetchTopics()
      .then((res) => {
        const { data } = res;
        setTopics(data);
      })
      .catch((err) => {
        console.error("fetchTopics failed:", err);
        setTopicError(true);
      })
      .finally(() => setTopicsLoading(false));
  }

  // fetch topics on mount
  useEffect(() => {
    loadTopics();
  }, []);

  // clean up on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopTimeout();
      if (
        matchStateRef.current === "waiting" &&
        selectedTopicsRef.current.length > 0 &&
        selectedDifficultyRef.current
      ) {
        leaveMatchQueueRequest(
          selectedTopicsRef.current.map((t) => Number(t.topicId)),
          selectedDifficultyRef.current,
        ).catch(() => {});
      }
    };
  }, []);

  async function handleMatchRequest() {
    if (selectedTopics.length === 0 || !selectedDifficulty) return;

    setMatchState("waiting");
    setMatchResult(null);
    startTimer();

    timeoutRef.current = setTimeout(() => {
      setMatchState("timeout");
      stopTimer();
      leaveMatchQueueRequest(
        selectedTopics.map((t) => Number(t.topicId)),
        selectedDifficulty!,
      ).catch(() => {});
    }, MATCH_TIMEOUT_MS);

    try {
      const res = await joinMatchQueueRequest(
        selectedTopics.map((t) => Number(t.topicId)),
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

    if (selectedTopics.length === 0 || !selectedDifficulty) return;
    try {
      await leaveMatchQueueRequest(
        selectedTopics.map((t) => Number(t.topicId)),
        selectedDifficulty,
      );
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
    selectedTopics,
    toggleTopic,
    topics,
    topicLoading,
    topicError,
    retryTopics: loadTopics,
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
