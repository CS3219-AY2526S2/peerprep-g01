import type Question from "../types/question";
import apiFetch from "../utils/apiFetch";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface fetchQuestionParams {
  page?: number;
  limit?: number;
  difficulty?: "Easy" | "Medium" | "Hard" | null;
  topicId?: string | null;
  sortBy?: "createdAt" | "questionName" | "difficulty";
  sortOrder?: "desc" | "asc";
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

  const response = await apiFetch(
    `${BASE_URL}/api/questions?${query.toString()}`,
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

async function deleteQuestion(questionId: string) {
  const response = await apiFetch(`${BASE_URL}/api/questions/${questionId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let message = `Delete question (${questionId}) request failed`;
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

async function addQuestion(
  question: Omit<
    Question,
    "questionId" | "createdAt" | "modifiedAt" | "createdBy" | "modifiedBy"
  >,
) {
  console.log("sending:", JSON.stringify(question));
  const response = await apiFetch(`${BASE_URL}/api/questions/add/`, {
    method: "POST",
    body: JSON.stringify(question),
  });

  if (!response.ok) {
    let message = `Add question (${question.questionName}) request failed`;
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

async function updateQuestion(
  question: Omit<
    Question,
    "createdAt" | "modifiedAt" | "createdBy" | "modifiedBy"
  >,
) {
  const response = await apiFetch(
    `${BASE_URL}/api/questions/${question.questionId}`,
    {
      method: "PUT",
      body: JSON.stringify(question),
    },
  );

  if (!response.ok) {
    let message = `Update question (${question.questionId}) request failed`;
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

export { fetchQuestions, deleteQuestion, updateQuestion, addQuestion };
