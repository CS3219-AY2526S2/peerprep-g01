import { useState } from "react";
import type User from "../types/user";
import {
  fetchUsers,
  deleteUser as deleteUserRequest,
} from "../services/userService";

function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [cursorOffset, setCursorOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // fetch first page of users in database
  async function loadUsers(params = {}) {
    setIsLoading(true);
    setError(null);
    try {
      const { data, pagination } = await fetchUsers(params);
      setUsers(data);
      setCursorOffset(0);
      setNextCursor(pagination.nextCursor);
      setHasMore(pagination.hasMore);
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

  // fetch next page's users
  async function loadNextUsers() {
    if (!hasMore || !nextCursor) return;
    setIsLoading(true);
    try {
      const { data, pagination } = await fetchUsers({ cursor: nextCursor });
      setCursorOffset((prev) => prev + users.length);
      setUsers((prev) => [...prev, ...data]);
      setNextCursor(pagination.nextCursor);
      setHasMore(pagination.hasMore);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteUser(userId: string) {
    setDeletingUserId(userId);
    try {
      await deleteUserRequest(userId);
      // remove from local state immediately — no need to refetch
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        console.log("An unexpected error occurred");
      }
    } finally {
      setDeletingUserId(null);
    }
  }

  return {
    users,
    isLoading,
    error,
    loadUsers,
    cursorOffset,
    loadNextUsers,
    deleteUser,
    deletingUserId,
  };
}

export default useUsers;
