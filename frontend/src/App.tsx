import AppRouter from "./routes/AppRouter";
import { ThemeProvider } from "@mui/material/styles";
import tableTheme from "./theme";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      useAuthStore.getState().clearUser();
    } else {
      useAuthStore.getState().setUser(JSON.parse(user));
    }
  }, []);

  return (
    <ThemeProvider theme={tableTheme}>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
