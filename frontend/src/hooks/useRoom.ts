import { useCallback, useEffect, useState } from "react";
import useAuthStore from "../store/authStore";

// Mirrors the MatchQuestion shape used throughout the collab service
export interface MatchQuestion {
  questionId: number;
  title: string;
  description: string;
  topicName: string;
  difficulty: "easy" | "medium" | "hard";
  testCases?: string;
  constraints?: string;
}

export interface Room {
  roomId: string;
  sessionId: string;
  userOneId: string;
  userTwoId: string;
  question: MatchQuestion;
  connectedCount: number;
  createdAt: string;
}

const COLLAB_API = "/api/collab";

function useRoom() {
  const { token } = useAuthStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${COLLAB_API}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch rooms (${res.status})`);
      const data: Room[] = await res.json();
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  function handleSearch(keyword: string) {
    const lower = keyword.toLowerCase().trim();
    if (!lower) {
      setFilteredRooms(rooms);
      return;
    }
    setFilteredRooms(
      rooms.filter(
        (r) =>
          r.roomId.toLowerCase().includes(lower) ||
          r.userOneId.toLowerCase().includes(lower) ||
          r.userTwoId.toLowerCase().includes(lower) ||
          r.question.title.toLowerCase().includes(lower) ||
          r.question.topicName.toLowerCase().includes(lower),
      ),
    );
  }

  return {
    rooms: filteredRooms,
    isLoading,
    error,
    handleSearch,
    refetch: fetchRooms,
  };
}

export default useRoom;
