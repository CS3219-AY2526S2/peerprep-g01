import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminSideMenu from "../features/admin/AdminSideMenu";
import AdminTable from "../features/admin/AdminTable";
import SearchBar from "../components/SearchBar";
import AdminTableAddButton from "../components/RoundedFilledButton";
import useQuestion from "../hooks/useQuestion";
import { useEffect, useState } from "react";
import type Question from "../types/question";

function ManageQuestionPage() {
  const tableFields = [
    "#",
    "Question Title",
    "Topic",
    "Difficulty",
    "CreatedAt",
    "",
  ];

  // remove hard code in the future for topics
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

  const {
    questions,
    isLoading,
    error,
    loadQuestions,
    deleteQuestion,
    deletingQuestionId,
    page,
  } = useQuestion();

  const [confirmTarget, setConfirmTarget] = useState<Question | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  // todo
  async function handleSearchSubmit() {}

  function handleDeleteClick(question: Question) {
    setConfirmTarget(question);
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    await deleteQuestion(confirmTarget.questionId);
    setConfirmTarget(null);
  }

  function handleCancelDelete() {
    setConfirmTarget(null);
  }

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AdminSideMenu />
      <AdminTable
        tableButtons={[
          <SearchBar submitHandler={handleSearchSubmit} />,
          <AdminTableAddButton label={"Add Question"} />,
        ]}
        tableFields={tableFields}
        rows={questions}
        isLoading={isLoading}
        error={error}
        renderRow={(question, index) => (
          <TableRow key={question.questionId} hover sx={{ width: "100%" }}>
            <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
            <TableCell>{question.questionName}</TableCell>
            <TableCell>{topics[question.topicId]}</TableCell>
            <TableCell>{question.difficulty}</TableCell>
            <TableCell>
              {new Date(question.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <IconButton
                size="small"
                onClick={() => handleDeleteClick(question)}
                aria-label={`Delete ${question.questionId}`}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        )}
      />

      <Dialog open={!!confirmTarget} onClose={handleCancelDelete}>
        <DialogTitle>Delete Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{confirmTarget?.questionName}</strong> (
            {confirmTarget?.questionId})
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={!!deletingQuestionId}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageQuestionPage;
