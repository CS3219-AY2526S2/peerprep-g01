import { useState } from "react";
import useAuthStore from "../store/authStore";
import { loginUser, registerUser, logoutUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

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
    await logoutUser();
  }

  return { login, logout, register, error, isLoading };
}

export default useAuth;
