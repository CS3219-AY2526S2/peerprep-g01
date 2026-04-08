import { useState } from "react";
import type Question from "../../types/question";
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
import DeleteIcon from "@mui/icons-material/Delete";

// interfaces
interface QuestionFormProps {
  open: boolean;
  isActive: boolean;
  mode?: "edit" | "add";
  initialData?: Question | null;
  onCancel: () => void;
  onConfirm: (
    question: Omit<
      Question,
      "createdAt" | "modifiedAt" | "createdBy" | "modifiedBy"
    >,
  ) => void;
}

interface TestCase {
  input: string;
  output: string;
  type: "public" | "private";
}

interface FormFields {
  questionName: string;
  topicId: string;
  difficulty: "Easy" | "Medium" | "Hard" | "";
  description: string;
  testCases: TestCase[];
}

// constants
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

const EMPTY_FORM: FormFields = {
  questionName: "",
  topicId: "",
  difficulty: "",
  description: "",
  testCases: [],
};

function buildFormFromQuestion(q: Question): FormFields {
  return {
    questionName: q.questionName,
    topicId: q.topicId,
    difficulty: q.difficulty,
    description: q.description,
    testCases: [
      ...(q.publicTestCase ?? []).map((tc) => ({
        ...tc,
        type: "public" as const,
      })),
      ...(q.privateTestCase ?? []).map((tc) => ({
        ...tc,
        type: "private" as const,
      })),
    ],
  };
}

// exported component
function QuestionForm({
  open,
  isActive,
  mode,
  initialData,
  onCancel,
  onConfirm,
}: QuestionFormProps) {
  const [fields, setFields] = useState<FormFields>(() =>
    mode === "edit" && initialData
      ? buildFormFromQuestion(initialData)
      : EMPTY_FORM,
  );

  const { questionName, topicId, difficulty, description, testCases } = fields;
  const isValid = questionName && topicId && difficulty && description;
  const isEditMode = mode === "edit";

  function setField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function addTestCase() {
    setField("testCases", [
      ...testCases,
      { input: "", output: "", type: "public" },
    ]);
  }

  function updateTestCase(index: number, key: keyof TestCase, value: string) {
    setField(
      "testCases",
      testCases.map((tc, i) => (i === index ? { ...tc, [key]: value } : tc)),
    );
  }

  function removeTestCase(index: number) {
    setField(
      "testCases",
      testCases.filter((_, i) => i !== index),
    );
  }

  function handleConfirm() {
    if (!isValid) return;
    onConfirm({
      questionId: isEditMode && initialData ? initialData.questionId : "",
      questionName,
      topicId,
      difficulty: difficulty as "Easy" | "Medium" | "Hard",
      description,
      publicTestCase: testCases
        .filter((tc) => tc.type === "public")
        .map(({ input, output }) => ({ input, output })),
      privateTestCase: testCases
        .filter((tc) => tc.type === "private")
        .map(({ input, output }) => ({ input, output })),
    });
  }

  function handleCancel() {
    setFields(EMPTY_FORM);
    onCancel();
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditMode ? "Edit Question" : "Add a Question"}
      </DialogTitle>
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
          onChange={(e) => setField("questionName", e.target.value)}
          fullWidth
          size="small"
        />
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Topic</InputLabel>
            <Select
              label="Topic"
              value={topicId}
              onChange={(e) => setField("topicId", e.target.value)}
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
              onChange={(e) =>
                setField(
                  "difficulty",
                  e.target.value as "Easy" | "Medium" | "Hard",
                )
              }
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
          onChange={(e) => setField("description", e.target.value)}
          multiline
          rows={8}
          fullWidth
          size="small"
        />

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
          disabled={!isValid || isActive}
          onClick={handleConfirm}
        >
          {isEditMode ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuestionForm;
