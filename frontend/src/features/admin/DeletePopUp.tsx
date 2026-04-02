import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface DeletePopUpProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeletePopUp({
  open,
  title,
  description,
  isDeleting,
  onConfirm,
  onCancel,
}: DeletePopUpProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeletePopUp;
