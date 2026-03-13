import { Box, TableCell, TableRow } from "@mui/material";
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

  const { users, isLoading, error, loadUsers, cursorOffset } = useUsers();

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
        renderRow={(user, index) => (
          <TableRow key={user.userId} hover sx={{ width: "100%" }}>
            <TableCell>{cursorOffset + index + 1}</TableCell>
            <TableCell>{user.userName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>(Coming Soon)*</TableCell>
          </TableRow>
        )}
      />
    </Box>
  );
}

export default ManageUserPage;
