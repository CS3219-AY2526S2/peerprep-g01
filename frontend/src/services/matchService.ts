const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import apiFetch from "../utils/apiFetch";
import useAuthStore from "../store/authStore";

async function joinMatchQueue(topics: number[], difficulty: string) {
  const userId = useAuthStore.getState().user?.userId;
  const response = await apiFetch(`${BASE_URL}/api/match`, {
    method: "POST",
    body: JSON.stringify({
      userId,
      topics,
      difficulty: difficulty.toLowerCase(),
    }),
  });
  if (!response.ok) {
    let message = "Failed to join match queue";
    try {
      const err = await response.json();
      message = err.message ?? err.error ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }
  return response.json();
}

async function leaveMatchQueue(topics: number[], difficulty: string) {
  const userId = useAuthStore.getState().user?.userId;
  const response = await apiFetch(`${BASE_URL}/api/match`, {
    method: "DELETE",
    body: JSON.stringify({ userId, topics, difficulty: difficulty.toLowerCase() }),
  });
  if (!response.ok) {
    let message = "Failed to leave match queue";
    try {
      const err = await response.json();
      message = err.message ?? err.error ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }
  return response.json();
}

async function getMatchStatus() {
  const userId = useAuthStore.getState().user?.userId;
  const response = await apiFetch(`${BASE_URL}/api/match/status/${userId}`);
  if (!response.ok) {
    let message = "Failed to get match status";
    try {
      const err = await response.json();
      message = err.message ?? err.error ?? message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }
  return response.json();
}

export { joinMatchQueue, leaveMatchQueue, getMatchStatus };
