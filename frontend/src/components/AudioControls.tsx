import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import useAudioChat from "../hooks/useAudioChat";
import type { Socket } from "socket.io-client";

interface AudioControlsProps {
  socket: Socket | null;
  myUserId: string;
  isUserOne: boolean;
  roomId: string;
}

export default function AudioControls({
  socket,
  myUserId,
  isUserOne,
  roomId,
}: AudioControlsProps) {
  const { micOn, partnerMicOn, audioConnected, toggleMic } = useAudioChat({
    socket,
    myUserId,
    isUserOne,
    roomId,
  });

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Tooltip title={micOn ? "Mute" : "Unmute"}>
        <IconButton
          onClick={toggleMic}
          sx={{
            bgcolor: micOn ? "success.main" : "grey.700",
            color: "#fff",
            "&:hover": { bgcolor: micOn ? "success.dark" : "grey.600" },
            width: 36,
            height: 36,
          }}
        >
          {micOn ? <MicIcon fontSize="small" /> : <MicOffIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {partnerMicOn ? "Partner: unmuted" : "Partner: muted"}
      </Typography>

      {audioConnected && (
        <Typography
          variant="caption"
          sx={{ color: "success.main", fontWeight: 600 }}
        >
          Connected
        </Typography>
      )}
    </Box>
  );
}
