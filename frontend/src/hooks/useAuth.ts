import { useState } from "react";
import useAuthStore from "../store/authStore";
import { loginUser } from "../services/userService";

function useAuth() {
  const { setUser, clearUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(email: string, password: string) {
    setIsLoading(true);
    setError(null);
    try {
      const { token, user } = await loginUser(email, password);
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
