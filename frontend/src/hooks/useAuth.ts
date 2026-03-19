import { useState } from "react";
import useAuthStore from "../store/authStore";
import { loginUser } from "../services/userService";
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
      const { token, user } = await loginUser(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
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

  function logout() {
    localStorage.removeItem("token");
    clearUser();
  }

  return { login, logout, error, isLoading };
}

export default useAuth;
