import { Box, TableCell, TableRow } from "@mui/material";
import AdminSideMenu from "../features/admin/AdminSideMenu";
import AdminTable from "../features/admin/AdminTable";
import SearchBar from "../components/SearchBar";
import AdminTableAddButton from "../components/RoundedFilledButton";
import useQuestion from "../hooks/useQuestion";
import { useEffect } from "react";

function ManageQuestionPage() {
  const tableFields = [
    "#",
    "Question Title",
    "Topic",
    "Difficulty",
    "CreatedAt",
  ];

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

  const { questions, isLoading, error, loadQuestions, page } = useQuestion();

  useEffect(() => {
    loadQuestions();
  }, []);

  // todo
  async function handleSearchSubmit() {}

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
          </TableRow>
        )}
      />
    </Box>
  );
}

export default ManageQuestionPage;
