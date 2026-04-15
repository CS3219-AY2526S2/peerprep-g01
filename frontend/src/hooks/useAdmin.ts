import { useState } from "react";
import type User from "../types/user";
import {
  fetchAdmins,
  createAdmin as createAdminService,
  deleteAdmin as deleteAdminService,
} from "../services/adminService";

const PAGE_SIZE = 10;

function useAdmins() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function loadAdmins(targetPage: number = 1) {
    setIsLoading(true);
    setError(null);
    try {
      const { data, pagination } = await fetchAdmins(targetPage, PAGE_SIZE);
      setAdmins(data);
      setPage(pagination.page);
      setTotalPages(pagination.totalPages);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else console.log("An unexpected error occurred");
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

  async function createAdmin(email: string) {
    setIsCreating(true);
    try {
      await createAdminService(email);
      await loadAdmins(page);
    } finally {
      setIsCreating(false);
    }
  }

  async function deleteAdmin(email: string, userId: string) {
    setDeletingUserId(userId);
    try {
      await deleteAdminService(email, userId);
      await loadAdmins(page);
    } finally {
      setDeletingUserId(null);
    }
  }

  return {
    admins,
    isLoading,
    error,
    loadAdmins,
    loadNextPage,
    page,
    totalPages,
    loadPrevPage,
    createAdmin,
    deleteAdmin,
    deletingUserId,
    isCreating,
  };
}

export default useAdmins;
