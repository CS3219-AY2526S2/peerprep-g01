import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function UserHomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Check if the user has admin privileges
  const isAdmin = user?.role === "2" || "3";

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1">This is supposedly home</Typography>

      {isAdmin && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/manage-user")}
          sx={{ mt: 2 }}
        >
          Manage Admins (User Directory)
        </Button>
      )}
    </Box>
  );
}

export default UserHomePage;
