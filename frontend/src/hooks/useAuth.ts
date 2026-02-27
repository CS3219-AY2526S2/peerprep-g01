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
        email,
        password,
        userName: "testuser",
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
    } catch (err: any) {
      setError(err.message);
      console.log(error);
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
