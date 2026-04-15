import { useState } from "react";
import useAuthStore from "../store/authStore";
import { loginUser, registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function useAuth() {
  const { setUser, clearUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function login(email: string, password: string) {
    setIsLoading(true);
    setError(null);
    try {
      const { user } = await loginUser(email, password);
      setUser(user);
      if (user.role === "1") {
        navigate("/home");
      } else {
        navigate("/admin/manage-admin");
      }
      return true;
    } catch {
      setError("Invalid email or password");
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(userName: string, email: string, password: string) {
    setIsLoading(true);
    setError(null);
    try {
      await registerUser(userName, email, password);
      navigate("/login");
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

  async function logout() {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Even if the network call fails, clear local state so the UI logs out.
    }
    clearUser();
  }

  return { login, logout, register, error, isLoading };
}

export default useAuth;
