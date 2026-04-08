import type User from "../types/user";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        setUser: (user: User, token: string) =>
          set({ user, token, isAuthenticated: true }),
        clearUser: () =>
          set({ user: null, token: null, isAuthenticated: false }),
      }),
      {
        name: "auth",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
    { name: "authStore" },
  ),
);
export default useAuthStore;
