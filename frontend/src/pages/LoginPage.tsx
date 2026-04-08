import logo from "../assets/peerprep-logo-nobg.png";
import { Grid, Typography } from "@mui/material";
import LoginForm from "../features/auth/LoginForm";

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
        <LoginForm />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
