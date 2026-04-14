import logo from "../assets/peerprep-logo-nobg.png";
import {
  Container,
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

interface FieldErrors {
  userName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function SignUpPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { register, error, isLoading } = useAuth();

  function validate(): boolean {
    const errors: FieldErrors = {};

    if (!userName.trim()) {
      errors.userName = "Username is required.";
    } else if (userName.trim().length < 3) {
      errors.userName = "Username must be at least 3 characters.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      setPassword("");
      setConfirmPassword("");
      return;
    }
    const success = await register(userName.trim(), email.trim(), password);
    if (!success) {
      setPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <Container maxWidth="sm">
      <Stack
        sx={{
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={logo} alt="logo image" style={{ width: 300 }} />
        <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
          Real-time collaboration for real-world interviews at your fingertips
        </Typography>

        <Typography variant="h5" sx={{ marginTop: "4rem" }}>
          Create an account
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Enter your details to sign up
        </Typography>

        <Stack sx={{ width: 350 }}>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                margin: "1.3rem 0",
              }}
            >
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Username"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                error={!!fieldErrors.userName}
                helperText={fieldErrors.userName}
                size="small"
                fullWidth
              />
              <TextField
                label="email@domain.com"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                size="small"
                fullWidth
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                size="small"
                fullWidth
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                size="small"
                fullWidth
              />
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
                Sign up with email
              </Button>
            </Box>
          </form>

          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: "center", width: 300, alignSelf: "center" }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "inherit" }}>
              Login here
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}

export default SignUpPage;
