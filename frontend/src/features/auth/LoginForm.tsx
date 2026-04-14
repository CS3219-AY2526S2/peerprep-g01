import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Typography, Stack, Box, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";

function LoginForm() {
  const [email, setUserEmail] = useState("");
  const [password, setUserPassword] = useState("");
  const { login, isLoading } = useAuth();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Login with your email and password
      </Typography>
      <Stack sx={{ width: 300 }}>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              margin: "1.3rem 0",
            }}
          >
            <TextField
              label="email@domain.com"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setUserEmail(e.target.value)}
              size="small"
              fullWidth
            ></TextField>
            <TextField
              label="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setUserPassword(e.target.value)}
              size="small"
              fullWidth
            ></TextField>
            <Button
              type="submit"
              variant="contained"
              loading={isLoading}
              fullWidth
              sx={{
                bgcolor: "common.black",
                "&:hover": { bgcolor: "#333" },
                textTransform: "none",
                fontWeight: 400,
                padding: "8px 14px",
              }}
            >
              Login
            </Button>
          </Box>
        </form>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ textAlign: "center", width: 300, alignSelf: "center" }}
        >
          Don't have an account yet?{" "}
          <Link to="/signup" style={{ color: "inherit" }}>
            Sign up here
          </Link>
        </Typography>
      </Stack>
    </Stack>
  );
}

export default LoginForm;
