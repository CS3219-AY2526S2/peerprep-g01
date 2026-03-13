import { Box } from "@mui/material";
import AdminSideMenu from "../features/admin/AdminSideMenu";
import AdminTable from "../features/admin/AdminTable";
import SearchBar from "../components/SearchBar";
import useUsers from "../hooks/useUsers";
import { useEffect } from "react";

function ManageUserPage() {
  const tableFields = [
    "#",
    "UserName",
    "Email",
    "JoinedDate",
    "QuestionsCompleted",
  ];
  const { users, isLoading, error, loadUsers } = useUsers();

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AdminSideMenu />
      <AdminTable
        tableButtons={[<SearchBar />]}
        tableFields={tableFields}
        rows={users}
        isLoading={isLoading}
        error={error}
      />
    </Box>
  );
}

export default ManageUserPage;
