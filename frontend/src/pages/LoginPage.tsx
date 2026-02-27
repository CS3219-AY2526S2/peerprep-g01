import logo from "../assets/peerprep-logo-nobg.png";
import { Grid, Typography, Stack, Box, TextField, Button } from "@mui/material";

const gridItem = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem",
};

function LoginPage() {
  return (
    <Grid container sx={{ width: "100vw", height: "100vh" }}>
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          ...gridItem,
          bgcolor: "primary.main",
          display: { xs: "none", md: "flex" },
        }}
      >
        <img
          src={logo}
          alt="logo icon"
          style={{ width: 350, filter: "invert(100%)" }}
        />
        <Typography
          variant="subtitle1"
          color="common.white"
          sx={{ textAlign: "center" }}
        >
          Another session of grinding, comaraderie and crying awaits beyond
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }} sx={{ ...gridItem, minWidth: 370 }}>
        <Typography
          variant="h3"
          color="primary.main"
          sx={{ margin: "2rem 0", fontWeight: 700 }}
        >
          Welcome back!
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Login with your email and password
        </Typography>

        <Stack sx={{ width: 300 }}>
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
                type="email"
                size="small"
                fullWidth
              ></TextField>
              <TextField
                label="password"
                name="password"
                type="password"
                size="small"
                fullWidth
              ></TextField>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "common.black",
                  "&:hover": { bgcolor: "#333" },
                  textTransform: "none",
                  fontWeight: 300,
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
            Don't have an account yet? Sign up with us here instead!
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
