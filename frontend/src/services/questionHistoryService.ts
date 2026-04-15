const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import apiFetch from "../utils/apiFetch";

export interface RawHistoryEntry {
  historyId: number;
  questionId: string;
  attemptStatus: "completed" | "attempted";
  partnerId: string | null;
  sessionEndAt: string | null;
}

interface QuestionHistoryResponse {
  success: boolean;
  data: RawHistoryEntry[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

async function fetchMyQuestionHistory(): Promise<RawHistoryEntry[]> {
  const response = await apiFetch(
    `${BASE_URL}/api/question_history?limit=100&sort=sessionEndAt&order=desc`,
  );

  if (!response.ok) {
    let message = "Fetch attempt history failed";
    try {
      const err = await response.json();
      message = err.message ?? err.error ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  const body: QuestionHistoryResponse = await response.json();
  return body.data;
}

export { fetchMyQuestionHistory };
