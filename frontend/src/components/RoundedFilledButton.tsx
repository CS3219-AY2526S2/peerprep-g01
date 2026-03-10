import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AdminTableAddButtonProps {
  label?: string;
}

function AdminTableAddButton({ label }: AdminTableAddButtonProps) {
  return (
    <Button
      size="medium"
      variant="contained"
      startIcon={<AddIcon />}
      sx={{
        bgcolor: "#1e293b",
        borderRadius: 4,
        fontSize: 10,
        textTransform: "none",
      }}
    >
      {label}
    </Button>
  );
}

export default AdminTableAddButton;
