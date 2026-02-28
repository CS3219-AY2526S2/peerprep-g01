import { useState } from "react";
import { type User } from "../types/user";
import useAuthStore from "../store/authStore";

function mockLoginUser(
  email: string,
  password: string,
): { token: string; user: User } {
  if (email === "test@test.com" && password === "password") {
    return {
      token: "mock-token-123",
      user: {
        userId: "1",
        userName: "testuser",
        email,
        role: "User",
      },
    };
  }
  throw new Error("Invalid email or password");
}

function useAuth() {
  const { setUser, clearUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(email: string, password: string) {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user } = mockLoginUser(email, password);
      localStorage.setItem("token", token);
      setUser(user);
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        console.log("An unexpected error occurred");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    clearUser();
  }

  return { login, logout, error, isLoading };
}

export default useAuth;
