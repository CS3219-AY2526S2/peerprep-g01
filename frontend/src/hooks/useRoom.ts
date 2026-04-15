import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchRooms, type Room } from "../services/roomService";

const PAGE_SIZE = 10;

function useRoom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRooms();
      setRooms(data);
      setFilteredRooms(data);
      setPage(1);
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
    setPage(1);
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
          r.question?.questionName,
          r.question?.topicName,
        ].some((field) => field?.toLowerCase().includes(lower)),
      ),
    );
  }

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / PAGE_SIZE));
  const pagedRooms = useMemo(
    () => filteredRooms.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredRooms, page],
  );

  function loadNextPage() {
    if (page < totalPages) setPage(page + 1);
  }

  function loadPrevPage() {
    if (page > 1) setPage(page - 1);
  }

  return {
    rooms: pagedRooms,
    isLoading,
    error,
    handleSearch,
    refetch: loadRooms,
    page,
    totalPages,
    loadNextPage,
    loadPrevPage,
  };
}

export default useRoom;
