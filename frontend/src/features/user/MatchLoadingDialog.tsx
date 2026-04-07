import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import kermitImg from "../../assets/waiting-kermit.png";

interface MatchLoadingDialogProps {
  open: boolean;
  topic: string;
  difficulty: string;
  elapsed: number;
  onCancel: () => void;
}

const DIFFICULTY_COLORS: Record<string, { bg: string; color: string }> = {
  easy: { bg: "#b3efb5", color: "#00a804" },
  medium: { bg: "#f9c87d", color: "#dd8603" },
  hard: { bg: "#fc887f", color: "#fe1100" },
};

function MatchLoadingDialog({
  open,
  topic,
  difficulty,
  elapsed,
  onCancel,
}: MatchLoadingDialogProps) {
  const diffStyle =
    DIFFICULTY_COLORS[difficulty.toLowerCase()] ?? DIFFICULTY_COLORS["medium"];

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 6,
          p: 2,
          textAlign: "center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2.5,
            py: 1,
          }}
        >
          {/* Title */}
          <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>
            Finding Your Partner
          </Typography>

          {/* Elapsed time */}
          <Typography variant="body2" color="text.secondary">
            Queueing Time: <strong>{elapsed}s</strong>
          </Typography>

          {/* Kermit gif */}
          <Box
            component="img"
            src={kermitImg}
            alt="waiting"
            sx={{
              width: 200,
              height: 200,
              objectFit: "cover",
              borderRadius: 3,
            }}
          />

          {/* Selected topic */}
          <Box sx={{ width: "100%", textAlign: "left" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.75 }}
            >
              Selected Topics:
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={topic}
                variant="outlined"
                sx={{ fontWeight: 700, borderRadius: 99 }}
              />
            </Box>
          </Box>

          {/* Selected difficulty */}
          <Box sx={{ width: "100%", textAlign: "left" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.75 }}
            >
              Selected Difficulty:
            </Typography>
            <Chip
              label={difficulty}
              sx={{
                bgcolor: diffStyle.bg,
                color: diffStyle.color,
                fontWeight: 700,
                borderRadius: 99,
              }}
            />
          </Box>

          {/* Cancel button */}
          <Button
            variant="contained"
            size="large"
            onClick={onCancel}
            fullWidth
            sx={{
              mt: 1,
              bgcolor: "#f5c842",
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
              borderRadius: 4,
              textTransform: "none",
              boxShadow: "none",
              py: 1.5,
              "&:hover": { bgcolor: "#e0b030", boxShadow: "none" },
            }}
          >
            Leave Queue
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default MatchLoadingDialog;
