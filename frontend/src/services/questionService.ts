const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface fetchQuestionParams {
  page?: number;
  limit?: number;
  difficulty?: "Easy" | "Medium" | "Hard" | null;
  topicId?: string | null;
  sortBy?: "createdAt" | "questionName" | "difficulty";
  sortOrder?: "desc" | "asc";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

async function fetchQuestions(params: fetchQuestionParams = {}) {
  const {
    page = 1,
    limit = 10,
    difficulty = null,
    topicId = null,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  query.set("sortBy", sortBy);
  query.set("sortOrder", sortOrder);
  if (difficulty) query.set("difficulty", difficulty);
  if (topicId) query.set("topicId", topicId);

  const response = await fetch(
    `${BASE_URL}/api/questions?${query.toString()}`,
    {
      headers: authHeaders(),
    },
  );

  if (!response.ok) {
    let message = "Fetch questions request failed";
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

export { fetchQuestions };
