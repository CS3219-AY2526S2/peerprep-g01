import { Box, Button, IconButton, useTheme } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../../assets/peerprep-logo-nobg.png";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog";

interface PageHeaderProps {
  isAdmin: boolean;
}

function PageHeader({ isAdmin }: PageHeaderProps) {
  const theme = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Box
      sx={{
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "white",
        borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
      }}
    >
      <img
        src={logo}
        alt="logo icon"
        style={{
          width: "100%",
          maxWidth: 150,
          filter: "invert(20%)",
          padding: theme.spacing(0.8, 1, 0.6, 1),
        }}
      />
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => navigate("/admin/manage-question")}
            sx={{
              bgcolor: "#1e293b",
              borderRadius: 4,
              fontSize: 10,
              textTransform: "none",
              height: "32px",
            }}
          >
            Switch to Admin View
          </Button>
        )}
        <IconButton
          onClick={() => setLogoutOpen(true)}
          sx={{ mr: 1 }}
          title="Logout"
        >
          <LogoutIcon />
        </IconButton>
      </Box>
      <ConfirmDialog
        open={logoutOpen}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmLabel="Logout"
        confirmColor="error"
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </Box>
  );
}

export default PageHeader;
