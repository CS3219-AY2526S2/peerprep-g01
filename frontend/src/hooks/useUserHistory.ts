import { useState } from "react";
import { fetchUserById } from "../services/userService";
import { fetchQuestionById } from "../services/questionService";
import { fetchMyQuestionHistory } from "../services/questionHistoryService";
import useAuthStore from "../store/authStore";

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

type RawHistoryRow = Omit<
  HistoryEntry,
  "questionName" | "topicName" | "difficulty"
>;

function useUserHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadHistory(userId: string) {
    setIsLoading(true);
    setError(null);
    setHistory([]);

    try {
      const authUserId = useAuthStore.getState().user?.userId;
      let rawHistory: RawHistoryRow[];

      if (userId === authUserId) {
        // Self-view: hit the user-accessible /api/question_history endpoint
        // directly so regular users (role '1') aren't blocked by the admin
        // gate on /api/users/:id.
        rawHistory = await fetchMyQuestionHistory();
      } else {
        // Admin viewing another user: the /api/users/:id path is admin-gated
        // and embeds questionHistory in the user object.
        const { data: user } = await fetchUserById(userId);
        rawHistory = user.questionHistory ?? [];
      }

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
