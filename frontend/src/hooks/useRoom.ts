import { useCallback, useEffect, useState } from "react";
import { fetchRooms, type Room } from "../services/roomService";

function useRoom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRooms();
      setRooms(data);
      setFilteredRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  function handleSearch(keyword: string) {
    const lower = keyword.toLowerCase().trim();
    if (!lower) {
      setFilteredRooms(rooms);
      return;
    }
    setFilteredRooms(
      rooms.filter((r) =>
        [
          r.roomId,
          r.userOneId,
          r.userTwoId,
          r.question.questionName,
          r.question.topicName,
        ].some((field) => field?.toLowerCase().includes(lower)),
      ),
    );
  }

  return {
    rooms: filteredRooms,
    isLoading,
    error,
    handleSearch,
    refetch: loadRooms,
  };
}

export default useRoom;
