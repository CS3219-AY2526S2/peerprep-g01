import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import type { HistoryEntry } from "../../hooks/useUserHistory";

const DIFFICULTY_COLORS: Record<
  "Easy" | "Medium" | "Hard",
  { color: string; bg: string }
> = {
  Easy: { color: "#2e7d32", bg: "#e8f5e9" },
  Medium: { color: "#e65100", bg: "#fff3e0" },
  Hard: { color: "#c62828", bg: "#ffebee" },
};

const STATUS_COLORS: Record<
  "completed" | "attempted",
  { color: string; bg: string }
> = {
  completed: { color: "#1565c0", bg: "#e3f2fd" },
  attempted: { color: "#6a1b9a", bg: "#f3e5f5" },
};

interface UserHistoryDialogProps {
  open: boolean;
  userName: string;
  history: HistoryEntry[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

function UserHistoryDialog({
  open,
  userName,
  history,
  isLoading,
  error,
  onClose,
}: UserHistoryDialogProps) {
  function renderBody() {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
            <CircularProgress size={28} />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (history.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No attempt history found.
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return history.map((entry, index) => {
      const difficultyStyle = entry.difficulty
        ? DIFFICULTY_COLORS[entry.difficulty]
        : null;
      const statusStyle = entry.attemptStatus
        ? STATUS_COLORS[entry.attemptStatus]
        : null;

      return (
        <TableRow key={entry.historyId} hover>
          <TableCell>{index + 1}</TableCell>
          <TableCell>
            {entry.questionName ?? (
              <Typography
                variant="body2"
                color="text.disabled"
                fontStyle="italic"
              >
                Deleted question ({entry.questionId})
              </Typography>
            )}
          </TableCell>
          <TableCell>{entry.topicName ?? "—"}</TableCell>
          <TableCell>
            {difficultyStyle ? (
              <Chip
                label={entry.difficulty}
                size="small"
                sx={{
                  color: difficultyStyle.color,
                  bgcolor: difficultyStyle.bg,
                  border: `1px solid ${difficultyStyle.color}`,
                  fontWeight: 500,
                }}
              />
            ) : (
              "—"
            )}
          </TableCell>
          <TableCell>
            {statusStyle ? (
              <Chip
                label={entry.attemptStatus}
                size="small"
                sx={{
                  color: statusStyle.color,
                  bgcolor: statusStyle.bg,
                  border: `1px solid ${statusStyle.color}`,
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              />
            ) : (
              "—"
            )}
          </TableCell>
          <TableCell sx={{ whiteSpace: "nowrap" }}>
            {entry.sessionEndAt
              ? new Date(entry.sessionEndAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </TableCell>
        </TableRow>
      );
    });
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Attempt History
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {userName}
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ overflowX: "auto" }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 500 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Question</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Topic</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Difficulty</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderBody()}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default UserHistoryDialog;
