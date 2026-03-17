import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, it, expect } from "vitest";
import useAuthStore from "./authStore";
import type User from "../types/user";

const mockUser: User = {
  userId: "1",
  userName: "test user",
  email: "test@test.com",
  role: "1",
};

// zustand is a singleton, need to reset before each test
beforeEach(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false });
});

describe("authStore", () => {
  it("should initialise with a null user and unauthenticated", () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should store user and mark as authenticated after successful setUser", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => result.current.setUser(mockUser));
  });
});
