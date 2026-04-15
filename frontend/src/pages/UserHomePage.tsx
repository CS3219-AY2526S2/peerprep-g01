import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
import PageHeader from "../features/user/PageHeader";
import useMatch from "../hooks/useMatch";
import MatchLoadingDialog from "../features/user/MatchLoadingDialog";
import MatchFoundDialog from "../features/user/MatchFoundDialog";

const DIFFICULTIES = [
  {
    label: "Easy",
    emoji: "😊",
    Subtitle: "Perfect for beginners",
    colors: "#00d607",
    bg: "#b3efb5",
  },
  {
    label: "Medium",
    emoji: "😐",
    Subtitle: "Challenge yourself",
    colors: "#dd8603",
    bg: "#f9c87d",
  },
  {
    label: "Hard",
    emoji: "🔥",
    Subtitle: "For Experts",
    colors: "#fe1100",
    bg: "#fc887f",
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose Topic",
    description: "Select the coding topic you want to practice",
  },
  {
    step: 2,
    title: "Pick Difficulty",
    description: "Select Easy, Medium or Hard level",
  },
  {
    step: 3,
    title: "Get Matched",
    description: "Queue for another coder to join your session",
  },
  {
    step: 4,
    title: "Solve Together",
    description: "Collabrate and solve problem as a pair",
  },
];

function UserHomePage() {
  const navigate = useNavigate();
  const {
    user,
    topics,
    topicLoading,
    topicError,
    retryTopics,
    selectedTopics,
    toggleTopic,
    selectedDifficulty,
    setSelectedDifficulty,
    matchState,
    matchResult,
    elapsed,
    handleMatchRequest,
    handleCancelMatch,
    handleEnterRoom,
  } = useMatch();

  // Check if the user has admin privileges
  const isAdmin = user?.role === "2" || user?.role === "3";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", pb: 6 }}>
      <PageHeader />
      {/* Dialogs */}
      <MatchLoadingDialog
        open={matchState === "waiting"}
        topics={selectedTopics.map((t) => t.topicName)}
        difficulty={selectedDifficulty ?? ""}
        elapsed={elapsed}
        onCancel={handleCancelMatch}
      />
      <MatchFoundDialog
        open={matchState === "matched"}
        question={matchResult?.question ?? null}
        onEnterRoom={handleEnterRoom}
      />

      {/*Admin shortcut*/}
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

      {/* Header */}
      <Box sx={{ textAlign: "center", pt: isAdmin ? 2 : 5, pb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Find Your Coding Partner
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Select a topic and difficulty, then match with another coder to solve
          problems together
        </Typography>
        {/* <Box sx={{
          display: "inline-flex", alignItems: "center", gap: 0.5, mt: 1.5,
          px: 1.5, py: 0.5, bgcolor: "#e8f5e9", borderRadius: 20,
        }}>
          <Typography variant="caption" sx={{ color: "#388e3c", fontWeight: 600 }}>
            1267 online now
          </Typography>
        </Box> */}
      </Box>

      {/* Main content */}
      <Box sx={{ maxWidth: 1000, mx: "auto", px: 2 }}>
        <Card variant="outlined" sx={{ borderRadius: 3, p: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
              Choose Your Challenge
            </Typography>

            {/*Topic Picker*/}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Select Topic
            </Typography>

            {topicLoading ? (
              <Typography variant="caption" color="text.secondary">
                Loading Topics...
              </Typography>
            ) : topicError ? (
              <Box sx={{ mb: 3, textAlign: "center" }}>
                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                  Failed to load topics.
                </Typography>
                <Button size="small" variant="outlined" onClick={retryTopics}>
                  Retry
                </Button>
              </Box>
            ) : (
              <Grid container spacing={4} sx={{ mb: 3 }}>
                {topics.map((t) => {
                  const selected = selectedTopics.some((s) => s.topicId === t.topicId);
                  return (
                    <Grid size={{ xs: 6, md: 3 }} key={t.topicId}>
                      <Box
                        onClick={() => toggleTopic(t)}
                        sx={{
                          border: selected
                            ? "2px solid #1976d2"
                            : "1px solid #e0e0e0",
                          bgcolor: selected ? "#97d2fb" : "#fff",
                          borderRadius: 2,
                          p: 1.5,
                          textAlign: "center",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          "&:hover": { borderColor: "#1972d2" },
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          fontSize={13}
                        >
                          {t.topicName}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {/* Difficulty Picker*/}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Select Difficulty
            </Typography>
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              {DIFFICULTIES.map((d) => {
                const selected = selectedDifficulty === d.label;
                return (
                  <Grid key={d.label} size={{ xs: 12, sm: 4 }}>
                    <Box
                      onClick={() => setSelectedDifficulty(d.label)}
                      sx={{
                        border: selected
                          ? `2px solid ${d.colors}`
                          : "1px solid #e0e0e0",
                        bgcolor: selected ? d.bg : "#ffffff",
                        borderRadius: 2,
                        p: 1.5,
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": { borderColor: d.colors },
                      }}
                    >
                      <Typography fontSize={24}>{d.emoji}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {" "}
                        {d.label}{" "}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {d.Subtitle}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* Selected Chips*/}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
                mb: 2,
              }}
            >
              <Typography variant="body2" fontWeight={600} fontSize={13}>
                Selected:{" "}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {selectedTopics.map((t) => (
                  <Chip
                    key={t.topicId}
                    label={t.topicName}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Chip
                label={selectedDifficulty}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            {/*Button*/}
            <Box sx={{ textAlign: "center" }}>
              <Button
                onClick={handleMatchRequest}
                variant="contained"
                size="large"
                startIcon={<GroupsIcon />}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                Find Partner & Start Coding
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                You'll be matched with someone of similar skill
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* How it works */}
      <Box
        sx={{
          mx: "auto",
          mt: 3,
          maxWidth: 940,
          bgcolor: "#c6dcf850",
          borderRadius: 3,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          How It Works
        </Typography>
        <Grid container spacing={2}>
          {HOW_IT_WORKS.map((item) => (
            <Grid size={{ xs: 6, md: 3 }} key={item.step}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "#1976d2",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 18,
                  mx: "auto",
                  mb: 1,
                }}
              >
                {item.step}
              </Box>
              <Typography variant="body2" fontWeight={700}>
                {item.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.description}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default UserHomePage;
