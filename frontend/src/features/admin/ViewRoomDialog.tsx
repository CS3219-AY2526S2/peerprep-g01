import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Chip,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { type Room } from "../../services/roomService";

interface ViewRoomDialogProps {
  room: Room | null;
  onClose: () => void;
}

const DIFFICULTY_COLOR: Record<string, "success" | "warning" | "error"> = {
  easy: "success",
  medium: "warning",
  hard: "error",
};

function ViewRoomDialog({ room, onClose }: ViewRoomDialogProps) {
  if (!room) return null;

  const { roomId, userOneId, userTwoId, question } = room;

  return (
    <Dialog open={!!room} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          pb: 1,
        }}
      >
        {`View Room - ${roomId}`}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* User IDs */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              User ID 1:
            </Typography>
            <TextField
              value={userOneId}
              size="small"
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              User ID 2:
            </Typography>
            <TextField
              value={userTwoId}
              size="small"
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />
          </Box>
        </Box>

        {/* Difficulty + Topic pills */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label={
              question.difficulty.charAt(0).toUpperCase() +
              question.difficulty.slice(1)
            }
            color={DIFFICULTY_COLOR[question.difficulty] ?? "default"}
            size="small"
            sx={{ borderRadius: 4, fontWeight: 500 }}
          />
          <Chip
            label={question.topicName}
            size="small"
            sx={{
              borderRadius: 4,
              bgcolor: "info.100",
              color: "info.dark",
              fontWeight: 500,
            }}
          />
        </Box>

        {/* Question Description */}
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
            Question Description:
          </Typography>
          <TextField
            value={question.description}
            multiline
            minRows={4}
            maxRows={8}
            fullWidth
            size="small"
            slotProps={{ input: { readOnly: true } }}
            sx={{ "& .MuiOutlinedInput-root": { bgcolor: "grey.50" } }}
          />
        </Box>

        {/* Test Cases */}
        {question.publicTestCase && (
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              Private Test Cases:
            </Typography>
            <TextField
              value={question.publicTestCase}
              multiline
              minRows={2}
              maxRows={5}
              fullWidth
              size="small"
              slotProps={{ input: { readOnly: true } }}
              sx={{ "& .MuiOutlinedInput-root": { bgcolor: "grey.50" } }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ViewRoomDialog;
