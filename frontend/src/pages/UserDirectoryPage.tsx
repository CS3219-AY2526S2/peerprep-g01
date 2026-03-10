import { Box } from "@mui/material";
import AdminSideMenu from "../features/admin/AdminSideMenu";
import AdminTable from "../features/admin/AdminTable";
import AdminTableAddButton from "../components/RoundedFilledButton";
import SearchBar from "../components/SearchBar";

const tableFields = [
  "#",
  "UserName",
  "Email",
  "Status",
  "JoinedDate",
  "LastActive",
  "QuestionsCompleted",
];

function UserDirectoryPage() {
  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AdminSideMenu />
      <AdminTable
        tableButtons={[
          <SearchBar />,
          <AdminTableAddButton label={"Add User"} />,
        ]}
        tableFields={tableFields}
      />
    </Box>
  );
}

export default UserDirectoryPage;
