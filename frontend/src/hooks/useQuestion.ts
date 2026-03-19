import type Question from "../types/question";
import { useState } from "react";
import {
  fetchQuestions,
  deleteQuestion as deleteQuestionRequest,
} from "../services/questionService";

function useQuestion() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null,
  );

  async function loadQuestions() {
    setIsLoading(true);
    setError(null);
    try {
      const { data, pagination } = await fetchQuestions();
      setQuestions(data);
      setPage(pagination.currentPage);
      setTotalPages(pagination.totalPages);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else console.log("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }
  async function deleteQuestion(questionId: string) {
    setDeletingQuestionId(questionId);
    try {
      await deleteQuestionRequest(questionId);
      setQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        console.log("An unexpected error occurred");
      }
    } finally {
      setDeletingQuestionId(null);
    }
  }

  return {
    questions,
    isLoading,
    error,
    page,
    totalPages,
    deletingQuestionId,
    loadQuestions,
    deleteQuestion,
  };
}

export default useQuestion;
