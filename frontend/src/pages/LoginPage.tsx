import logo from "../assets/placeholder-logo.png";
import {
  Container,
  Box,
  Stack,
  Typography,
  TextField,
  Button,
} from "@mui/material";

function LoginPage() {
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
        <Typography variant="subtitle1">
          Real-time collaboration for real-world interviews at you fingertips
        </Typography>

        <Typography variant="h5" sx={{ marginTop: "4rem" }}>
          Create an account
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Enter your email to sign up for this app
        </Typography>

        <Stack sx={{ width: 350 }}>
          <form>
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
                size="small"
                fullWidth
              ></TextField>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "black",
                  "&:hover": { bgcolor: "#333" },
                  textTransform: "none",
                  fontWeight: 300,
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
            By clicking continue, you agree to our Terms of Service and Privacy
            Policy
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}

export default LoginPage;
