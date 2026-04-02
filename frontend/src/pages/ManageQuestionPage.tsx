import { Box, Button, IconButton, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminSideMenu from "../features/admin/AdminSideMenu";
import AdminTable from "../features/admin/AdminTable";
import SearchBar from "../components/SearchBar";
import AdminTableAddButton from "../components/RoundedFilledButton";
import useQuestion from "../hooks/useQuestion";
import { useEffect, useState } from "react";
import type Question from "../types/question";
import DeletePopUp from "../features/admin/DeletePopUp";
import QuestionForm from "../features/admin/QuestionForm";

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
    isAdding,
    isEditing,
    error,
    loadQuestions,
    deleteQuestion,
    addQuestion,
    editQuestion,
    deletingQuestionId,
    page,
  } = useQuestion();

  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);
  const [editTarget, setEditTarget] = useState<Question | null>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  // todo
  async function handleSearchSubmit() {}

  function handleDeleteClick(question: Question) {
    setDeleteTarget(question);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await deleteQuestion(deleteTarget.questionId);
    setDeleteTarget(null);
  }

  function handleCancelDelete() {
    setDeleteTarget(null);
  }

  async function handleConfirmAdd(
    question: Omit<
      Question,
      "questionId" | "createdAt" | "modifiedAt" | "createdBy" | "modifiedBy"
    >,
  ) {
    await addQuestion(question);
    setAddFormOpen(false);
  }

  function handleCancelAdd() {
    setAddFormOpen(false);
  }

  function handleEditClick(question: Question) {
    setEditTarget(question);
  }

  async function handleConfirmEdit(
    question: Omit<
      Question,
      "createdAt" | "modifiedAt" | "createdBy" | "modifiedBy"
    >,
  ) {
    await editQuestion(question);
    setEditTarget(null);
  }

  function handleCancelEdit() {
    setEditTarget(null);
  }

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AdminSideMenu />
      <AdminTable
        tableButtons={[
          <SearchBar submitHandler={handleSearchSubmit} />,
          <AdminTableAddButton
            label={"Add Question"}
            onClick={() => setAddFormOpen(true)}
          />,
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
              <Box
                sx={{
                  minWidth: 100,
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 4,
                    fontSize: 10,
                    textTransform: "none",
                    color: "grey.600",
                    borderColor: "grey.400",
                    "&:hover": {
                      borderColor: "grey.600",
                      backgroundColor: "grey.50",
                    },
                  }}
                  onClick={() => handleEditClick(question)}
                >
                  Edit
                </Button>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(question)}
                  aria-label={`Delete ${question.questionId}`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
        )}
      />

      <DeletePopUp
        open={!!deleteTarget}
        title={"Delete Question"}
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.questionName}</strong> (
            {deleteTarget?.questionId})
          </>
        }
        isDeleting={!!deletingQuestionId}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <QuestionForm
        open={addFormOpen}
        isActive={isAdding}
        onCancel={handleCancelAdd}
        onConfirm={handleConfirmAdd}
      />

      <QuestionForm
        key={editTarget?.questionId}
        open={!!editTarget}
        isActive={isEditing}
        mode="edit"
        initialData={editTarget}
        onCancel={handleCancelEdit}
        onConfirm={handleConfirmEdit}
      />
    </Box>
  );
}

export default ManageQuestionPage;
