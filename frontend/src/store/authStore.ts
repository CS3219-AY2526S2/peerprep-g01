import type User from "../types/user";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setUser: (user: User) => set({ user, isAuthenticated: true }),
        clearUser: () => set({ user: null, isAuthenticated: false }),
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
