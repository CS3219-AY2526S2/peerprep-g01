import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: React.ReactNode;
  isLoading?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: "error" | "primary" | "warning" | "success";
  errorMessage?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  showCompletionOption?: boolean;
  isCompleted?: boolean;
  onCompletionChange?: (checked: boolean) => void;
}

function ConfirmDialog({
  open,
  title,
  description,
  isLoading = false,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "primary",
  errorMessage,
  showCompletionOption = false,
  isCompleted = false,
  onCompletionChange,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {showCompletionOption && (
          <FormControlLabel
            control={
              <Checkbox
                checked={isCompleted}
                onChange={(e) => onCompletionChange?.(e.target.checked)}
              />
            }
            label="Mark this question as completed"
            sx={{ mt: 2 }}
          />
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{cancelLabel}</Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={isLoading}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
