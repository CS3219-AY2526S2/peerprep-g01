import AppRouter from "./routes/AppRouter";
import { ThemeProvider } from "@mui/material/styles";
import tableTheme from "./theme";

function App() {
  return (
    <ThemeProvider theme={tableTheme}>
      <AppRouter />;
    </ThemeProvider>
  );
}

export default App;
