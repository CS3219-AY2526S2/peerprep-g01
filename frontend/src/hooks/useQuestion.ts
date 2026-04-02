import type Question from "../types/question";
import { useState } from "react";
import {
  fetchQuestions,
  deleteQuestion as deleteQuestionRequest,
  addQuestion as addQuestionRequest,
  updateQuestion as editQuestionRequest,
} from "../services/questionService";

function useQuestion() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
      else
        console.log(
          "An unexpected error occurred while attempting to load questions",
        );
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteQuestion(questionId: string) {
    setDeletingQuestionId(questionId);
    try {
      await deleteQuestionRequest(questionId);
      await loadQuestions();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else {
        console.log(
          "An unexpected error occurred while attempting to delete question",
        );
      }
    } finally {
      setDeletingQuestionId(null);
    }
  }

  async function addQuestion(
    question: Omit<
      Question,
      "questionId" | "createdAt" | "modifiedAt" | "createdBy" | "modifiedBy"
    >,
  ) {
    setIsAdding(true);

    try {
      await addQuestionRequest(question);
      await loadQuestions();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else {
        console.log(
          "An unexpected error occurred while attempting to add question",
        );
      }
    } finally {
      setIsAdding(false);
    }
  }

  async function editQuestion(
    question: Omit<
      Question,
      "createdAt" | "createdBy" | "modifiedAt" | "modifiedBy"
    >,
  ) {
    setIsEditing(true);

    try {
      await editQuestionRequest(question);
      await loadQuestions();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else
        console.log(
          "An unexpected error occurred while attempting to add question",
        );
    } finally {
      setIsEditing(false);
    }
  }

  return {
    questions,
    isLoading,
    isAdding,
    isEditing,
    error,
    page,
    totalPages,
    deletingQuestionId,
    loadQuestions,
    deleteQuestion,
    addQuestion,
    editQuestion,
  };
}

export default useQuestion;
