import { Box } from "@mui/material";
import AdminSideMenu from "../features/admin/AdminSideMenu";
import AdminTable from "../features/admin/AdminTable";
import SearchBar from "../components/SearchBar";
import AdminTableAddButton from "../components/RoundedFilledButton";

const tableFields = ["ID", "Question Title", "Topic", "Difficulty", "Status"];

function ManageQuestionPage() {
  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AdminSideMenu />
      <AdminTable
        tableButtons={[
          <SearchBar />,
          <AdminTableAddButton label={"Add Question"} />,
        ]}
        tableFields={tableFields}
      />
    </Box>
  );
}

export default ManageQuestionPage;
