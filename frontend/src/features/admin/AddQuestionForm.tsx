import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type Question from "../../types/question";
import DeleteIcon from "@mui/icons-material/Delete";

interface AddQuestionProps {
  open: boolean;
  isAdding: boolean;
  onCancel: () => void;
  onConfirm: (
    question: Omit<
      Question,
      "questionId" | "createdAt" | "modifiedAt" | "createdBy" | "modifiedBy"
    >,
  ) => void;
}

interface TestCase {
  input: string;
  output: string;
  type: "public" | "private";
}

function AddQuestionForm({
  open,
  isAdding,
  onCancel,
  onConfirm,
}: AddQuestionProps) {
  const [questionName, setQuestionName] = useState("");
  const [topicId, setTopicId] = useState<string>("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard" | "">(
    "",
  );
  const [description, setDescription] = useState("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  const topics: Record<string, string> = {
    "1": "Arrays",
    "2": "Strings",
    "3": "Linked Lists",
    "4": "Dynamic Programming",
    "5": "Graphs",
    "6": "Sorting",
    "7": "Trees",
    "8": "Heap",
    "9": "Recursion",
    "10": "Binary Search",
  };

  const isValid = questionName && topicId && difficulty && description;

  function addTestCase() {
    setTestCases((prev) => [
      ...prev,
      { input: "", output: "", type: "public" },
    ]);
  }

  function updateTestCase(index: number, field: keyof TestCase, value: string) {
    setTestCases((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc)),
    );
  }

  function removeTestCase(index: number) {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  }

  function handleConfirm() {
    if (!isValid) return;
    const publicTestCase = testCases
      .filter((tc) => tc.type === "public")
      .map((tc) => ({ input: tc.input, output: tc.output }));
    const privateTestCase = testCases
      .filter((tc) => tc.type === "private")
      .map((tc) => ({ input: tc.input, output: tc.output }));
    onConfirm({
      questionName,
      topicId,
      difficulty: difficulty as "Easy" | "Medium" | "Hard",
      description,
      publicTestCase,
      privateTestCase,
    });
  }

  function handleCancel() {
    setQuestionName("");
    setTopicId("");
    setDifficulty("");
    setDescription("");
    setTestCases([]);
    onCancel();
  }

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Add a Question</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: "16px !important",
        }}
      >
        <TextField
          label="Question Title"
          type="text"
          name="questionName"
          value={questionName}
          onChange={(e) => {
            setQuestionName(e.target.value);
          }}
          fullWidth
          size="small"
        ></TextField>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Topic</InputLabel>
            <Select
              label="Topic"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
            >
              {Object.entries(topics).map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Difficulty</InputLabel>
            <Select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TextField
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={8}
          fullWidth
          size="small"
        ></TextField>

        {testCases.map((tc, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              p: 1.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                Test Case {index + 1}
              </Typography>
              <IconButton size="small" onClick={() => removeTestCase(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            <TextField
              label="Input"
              value={tc.input}
              onChange={(e) => updateTestCase(index, "input", e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
            <TextField
              label="Output"
              value={tc.output}
              onChange={(e) => updateTestCase(index, "output", e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                label="Type"
                value={tc.type}
                onChange={(e) => updateTestCase(index, "type", e.target.value)}
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ))}

        <Button variant="outlined" onClick={addTestCase} fullWidth>
          + Add Test Case
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!isValid || isAdding}
          onClick={handleConfirm}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddQuestionForm;
