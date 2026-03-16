import { useState } from "react";
import type User from "../types/user";
import { fetchAdmins } from "../services/adminService";

const PAGE_SIZE = 10;

function useAdmins() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch first page of users in database
  async function loadAdmins(targetPage: number = 1) {
    setIsLoading(true);
    setError(null);
    try {
      const { data, pagination } = await fetchAdmins(targetPage, PAGE_SIZE);
      setAdmins(data);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        console.log("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function loadNextPage() {
    if (page < totalPages) loadAdmins(page + 1);
  }

  function loadPrevPage() {
    if (page > 1) loadAdmins(page - 1);
  }

  async function updateAdmin() {}

  async function deleteAdmin() {}

  return {
    admins,
    isLoading,
    error,
    loadAdmins,
    loadNextPage,
    page,
    totalPages,
    loadPrevPage,
    updateAdmin,
    deleteAdmin,
  };
}

export default useAdmins;
