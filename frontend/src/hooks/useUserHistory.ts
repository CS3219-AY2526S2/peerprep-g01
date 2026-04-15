import { useState } from "react";
import { fetchUserById } from "../services/userService";
import { fetchQuestionById } from "../services/questionService";

export interface HistoryEntry {
  historyId: number;
  questionId: string;
  attemptStatus: "completed" | "attempted";
  partnerId: string | null;
  sessionEndAt: string | null;
  // enriched from question service — null if question was deleted
  questionName: string | null;
  topicName: string | null;
  difficulty: "Easy" | "Medium" | "Hard" | null;
}

function useUserHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadHistory(userId: string) {
    setIsLoading(true);
    setError(null);
    setHistory([]);

    try {
      const { data: user } = await fetchUserById(userId);
      const rawHistory: Omit<
        HistoryEntry,
        "questionName" | "topicName" | "difficulty"
      >[] = user.questionHistory ?? [];

      if (rawHistory.length === 0) {
        setHistory([]);
        return;
      }

      // Fan out question lookups in parallel; treat 404/errors as deleted questions
      const enriched = await Promise.all(
        rawHistory.map(async (entry) => {
          if (!entry.questionId) {
            return {
              ...entry,
              questionName: null,
              topicName: null,
              difficulty: null,
            };
          }
          try {
            const { data: q } = await fetchQuestionById(entry.questionId);
            return {
              ...entry,
              questionName: q.questionName,
              topicName: q.topicName,
              difficulty: q.difficulty,
            };
          } catch {
            // Question deleted from question bank — still show the history row
            return {
              ...entry,
              questionName: null,
              topicName: null,
              difficulty: null,
            };
          }
        }),
      );

      setHistory(enriched);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  function clearHistory() {
    setHistory([]);
    setError(null);
  }

  return { history, isLoading, error, loadHistory, clearHistory };
}

export default useUserHistory;
