import { useEffect, useState } from "react";
import { Typography, Button, Box, Card, CardContent, Chip, LinearProgress, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Subtitles } from "@mui/icons-material";
import { fetchTopics } from "../services/questionService";

const DIFFICULTIES = [
  { label: "Easy", emoji: "😊", Subtitle: "Perfect for beginners" },
  { label: "Medium", emoji: "😐",  Subtitle: "Challenge yourself"},
  { label: "Hard", emoji: "🔥", Subtitle: "For Experts" },
]

const HOW_IT_WORKS = [
  { step: 1, title: "Choose Topic", description: "Select the coding topic you want to practice"},
  { step: 2, title: "Pick Difficulty", description: "Select Easy, Medium or Hard level"},
  { step: 3, title: "Get Matched", description: "Queue for another coder to join your session"},
  { step: 4, title: "Solve Together", description: "Collabrate and solve problem as a pair"},
]

function UserHomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Medium");
  const [topics, setTopics] = useState<{ topicId: string; topicName: string}[]>([]);
  const [topicLoading, setTopicsLoading] = useState(true);
  // Check if the user has admin privileges
  const isAdmin = user?.role === "2" || "3";


  useEffect(() => {
    fetchTopics()
      .then(({ data }) => {
        setTopics(data);
        if (data.length > 0) setSelectedTopic(data[0].topicName);
      })
      .catch(console.error)
      .finally(() => setTopicsLoading(false));
  }, []);


  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", pb: 6 }}>


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
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }} >
          Select a topic and difficulty, then match with another coder to solve problems together
        </Typography>
        <Box sx={{
          display: "inline-flex", alignItems: "center", gap: 0.5, mt: 1.5,
          px: 1.5, py: 0.5, bgcolor: "#e8f5e9", borderRadius: 20,
        }}>
          <Typography variant="caption" sx={{ color: "#388e3c", fontWeight: 600 }}>
            1267 online now
          </Typography>
        </Box>
      </Box>



    </Box>
  );
}

export default UserHomePage;
