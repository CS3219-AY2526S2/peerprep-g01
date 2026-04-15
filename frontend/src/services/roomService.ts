import apiFetch from "../utils/apiFetch";
import { type MatchQuestion } from "../hooks/useMatch";

export interface Room {
  roomId: string;
  sessionId: string;
  userOneId: string;
  userTwoId: string;
  question: MatchQuestion | null;
  connectedCount: number;
  createdAt: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchRooms(): Promise<Room[]> {
  const res = await apiFetch(`${BASE_URL}/api/collab/rooms`);
  if (!res.ok) throw new Error(`Failed to fetch rooms (${res.status})`);
  const json = await res.json();
  return json.data || [];
}
