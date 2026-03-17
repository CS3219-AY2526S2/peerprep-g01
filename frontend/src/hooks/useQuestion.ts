import type Question from "../types/question";
import { useState } from "react";
import { fetchQuestions } from "../services/questionService";

function useQuestion() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  return { questions, isLoading, error, page, totalPages, loadQuestions };
}

export default useQuestion;
