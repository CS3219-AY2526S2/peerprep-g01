import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CodeIcon from "@mui/icons-material/Code";
import GroupsIcon from "@mui/icons-material/Groups";
import type { MatchQuestion } from "../../hooks/useMatch";

interface MatchFoundDialogProps {
  open: boolean;
  question: MatchQuestion | null;
  onEnterRoom: () => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#00d607",
  medium: "#dd8603",
  hard: "#fe1100",
};

function MatchFoundDialog({
  open,
  question,
  onEnterRoom,
}: MatchFoundDialogProps) {
  const difficultyColor =
    DIFFICULTY_COLORS[question?.difficulty?.toLowerCase() ?? ""] ?? "#1976d2";

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, p: 1, textAlign: "center" },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            py: 2,
          }}
        >
          {/* Success icon */}
          <CheckCircleIcon sx={{ fontSize: 64, color: "#00d607" }} />

          <Typography variant="h6" fontWeight={700}>
            Match Found!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A partner has been found. Get ready to collaborate!
          </Typography>

          <Divider sx={{ width: "100%" }} />

          {/* Question info */}
          {question && (
            <Box
              sx={{
                width: "100%",
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                textAlign: "left",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CodeIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Your Question
                </Typography>
              </Box>
              {question.questionName && (
                <Typography variant="body2" fontWeight={600}>
                  {question.questionName}
                </Typography>
              )}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {question.difficulty && (
                  <Chip
                    label={question.difficulty}
                    size="small"
                    sx={{
                      bgcolor: difficultyColor + "22",
                      color: difficultyColor,
                      fontWeight: 600,
                      fontSize: 11,
                    }}
                  />
                )}
                {question.topicName && (
                  <Chip
                    label={question.topicName}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: 11 }}
                  />
                )}
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={<GroupsIcon />}
            onClick={onEnterRoom}
            fullWidth
            sx={{
              bgcolor: "common.black",
              "&:hover": { bgcolor: "#333" },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              py: 1.2,
            }}
          >
            Enter Collaboration Room
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default MatchFoundDialog;
