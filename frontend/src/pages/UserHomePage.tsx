import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PageHeader from "../features/user/PageHeader";
import useMatch from "../hooks/useMatch";
import MatchLoadingDialog from "../features/user/MatchLoadingDialog";
import MatchFoundDialog from "../features/user/MatchFoundDialog";
import useUserHistory from "../hooks/useUserHistory";
import { useEffect } from "react";

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

const DIFFICULTY_COLORS: Record<string, { color: string; bg: string }> = {
  Easy: { color: "#00a804", bg: "#e6f9e6" },
  Medium: { color: "#c97200", bg: "#fff3e0" },
  Hard: { color: "#d32f2f", bg: "#fdecea" },
};

function UserHomePage() {
  const {
    user,
    topics,
    topicDifficulties,
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

  const {
    history,
    isLoading: historyLoading,
    error: historyError,
    loadHistory,
  } = useUserHistory();

  const userId = user?.userId;

  useEffect(() => {
    if (userId) loadHistory(userId);
    // loadHistory has no useCallback — userId is the only meaningful dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const isAdmin = user?.role === "2" || user?.role === "3";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", pb: 6 }}>
      <PageHeader isAdmin={isAdmin} />
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

      {/* Header */}
      <Box sx={{ textAlign: "center", pt: 5, pb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Find Your Coding Partner
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Select a topic and difficulty, then match with another coder to solve
          problems together
        </Typography>
      </Box>

      {/* Main content — two-column layout */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Grid container spacing={2} alignItems="flex-start">
          {/* LEFT: Match configuration card (65%) */}
          <Grid size={{ xs: 12, md: 7.5 }}>
            <Card variant="outlined" sx={{ borderRadius: 3, p: 1 }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ mb: 1.5 }}
                >
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
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={retryTopics}
                    >
                      Retry
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={4} sx={{ mb: 3 }}>
                    {topics.map((t) => {
                      const selected = selectedTopics.some(
                        (s) => s.topicId === t.topicId,
                      );
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

                    // Which selected topics support this difficulty
                    const supportingTopics =
                      selectedTopics.length > 0
                        ? selectedTopics.filter((t) =>
                            (topicDifficulties.get(t.topicId) ?? []).includes(
                              d.label,
                            ),
                          )
                        : null; // null = no topics chosen, don't filter

                    const isDisabled =
                      supportingTopics !== null &&
                      supportingTopics.length === 0;

                    const showBreakdown =
                      selectedTopics.length > 1 && supportingTopics !== null;

                    return (
                      <Grid key={d.label} size={{ xs: 12, sm: 4 }}>
                        <Box
                          onClick={() =>
                            !isDisabled && setSelectedDifficulty(d.label)
                          }
                          sx={{
                            border: selected
                              ? `2px solid ${d.colors}`
                              : "1px solid #e0e0e0",
                            bgcolor: isDisabled
                              ? "#f5f5f5"
                              : selected
                                ? d.bg
                                : "#ffffff",
                            borderRadius: 2,
                            p: 1.5,
                            textAlign: "center",
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            opacity: isDisabled ? 0.45 : 1,
                            transition: "all 0.15s",
                            "&:hover": !isDisabled
                              ? { borderColor: d.colors }
                              : {},
                          }}
                        >
                          <Typography fontSize={24}>{d.emoji}</Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color={
                              isDisabled ? "text.disabled" : "text.primary"
                            }
                          >
                            {d.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {d.Subtitle}
                          </Typography>

                          {/* Per-topic availability breakdown (multi-topic only) */}
                          {showBreakdown && (
                            <Box
                              sx={{
                                mt: 0.75,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                                justifyContent: "center",
                              }}
                            >
                              {selectedTopics.map((t) => {
                                const has = (
                                  topicDifficulties.get(t.topicId) ?? []
                                ).includes(d.label);
                                return (
                                  <Chip
                                    key={t.topicId}
                                    label={t.topicName}
                                    size="small"
                                    sx={{
                                      fontSize: 10,
                                      height: 18,
                                      bgcolor: has ? "#e8f5e9" : "#fdecea",
                                      color: has ? "#2e7d32" : "#c62828",
                                      border: "none",
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          )}
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
          </Grid>

          {/* RIGHT: Attempt history panel (35%) */}
          <Grid size={{ xs: 12, md: 4.5 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                // Match the left card's approximate height by capping with overflow
                maxHeight: 600,
                height: "100%",
              }}
            >
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, flexShrink: 0 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  My Attempt History
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your recent coding sessions
                </Typography>
              </Box>
              <Divider />

              {/* Scrollable list */}
              <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1 }}>
                {historyLoading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", py: 4 }}
                  >
                    <CircularProgress size={28} />
                  </Box>
                ) : historyError ? (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ py: 3, textAlign: "center" }}
                  >
                    Failed to load history.
                  </Typography>
                ) : history.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      No attempts yet.
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Complete a session to see your history here.
                    </Typography>
                  </Box>
                ) : (
                  <Stack divider={<Divider />} spacing={0}>
                    {history.map((entry) => {
                      const diffStyle = DIFFICULTY_COLORS[
                        entry.difficulty ?? ""
                      ] ?? {
                        color: "#757575",
                        bg: "#f5f5f5",
                      };
                      const isCompleted = entry.attemptStatus === "completed";

                      return (
                        <Box
                          key={entry.historyId}
                          sx={{
                            py: 1.5,
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          {/* Question name + status icon */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            {isCompleted ? (
                              <CheckCircleOutlineIcon
                                fontSize="small"
                                sx={{
                                  color: "#2e7d32",
                                  mt: "1px",
                                  flexShrink: 0,
                                }}
                              />
                            ) : (
                              <RadioButtonUncheckedIcon
                                fontSize="small"
                                sx={{
                                  color: "#9e9e9e",
                                  mt: "1px",
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{
                                lineHeight: 1.4,
                                color: entry.questionName
                                  ? "text.primary"
                                  : "text.disabled",
                                fontStyle: entry.questionName
                                  ? "normal"
                                  : "italic",
                              }}
                            >
                              {entry.questionName ?? entry.questionId}
                              {!entry.questionName && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    ml: 0.5,
                                    color: "text.disabled",
                                    fontStyle: "italic",
                                  }}
                                >
                                  (Deleted question)
                                </Typography>
                              )}
                            </Typography>
                          </Box>

                          {/* Chips row */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.75,
                              flexWrap: "wrap",
                              pl: 3.5,
                            }}
                          >
                            {/* Topic */}
                            {entry.topicName && (
                              <Chip
                                label={entry.topicName}
                                size="small"
                                sx={{
                                  fontSize: 11,
                                  height: 20,
                                  bgcolor: "#e3f2fd",
                                  color: "#1565c0",
                                  border: "none",
                                }}
                              />
                            )}
                            {/* Difficulty */}
                            {entry.difficulty && (
                              <Chip
                                label={entry.difficulty}
                                size="small"
                                sx={{
                                  fontSize: 11,
                                  height: 20,
                                  bgcolor: diffStyle.bg,
                                  color: diffStyle.color,
                                  border: "none",
                                }}
                              />
                            )}
                            {/* Status */}
                            <Chip
                              label={isCompleted ? "Completed" : "Attempted"}
                              size="small"
                              sx={{
                                fontSize: 11,
                                height: 20,
                                bgcolor: isCompleted ? "#e8f5e9" : "#f5f5f5",
                                color: isCompleted ? "#2e7d32" : "#757575",
                                border: "none",
                              }}
                            />
                          </Box>

                          {/* Date */}
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ pl: 3.5 }}
                          >
                            {entry.sessionEndAt
                              ? new Date(entry.sessionEndAt).toLocaleDateString(
                                  undefined,
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )
                              : "--"}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* How it works */}
      <Box
        sx={{
          mx: "auto",
          mt: 3,
          maxWidth: 1200,
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
