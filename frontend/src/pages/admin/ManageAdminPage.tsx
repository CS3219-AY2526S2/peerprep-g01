import { Box, TableCell, TableRow } from "@mui/material";
import AdminSideMenu from "../../features/admin/AdminSideMenu";
import AdminTable from "../../features/admin/AdminTable";
import AdminTableAddButton from "../../components/RoundedFilledButton";
import SearchBar from "../../components/SearchBar";
import useAdmins from "../../hooks/useAdmin";
import { useEffect } from "react";

function ManageAdminPage() {
  const tableFields = [
    "#",
    "User Name",
    "Email",
    "Role",
    "Joined Date",
    "Status",
  ];

  const roles: Record<string, string> = {
    "1": "User",
    "2": "Admin",
    "3": "Super Admin",
  };

  const { admins, isLoading, error, loadAdmins, page } = useAdmins();

  useEffect(() => {
    loadAdmins();
  }, []);

  //todo
  async function handleSearchSubmit() {}

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AdminSideMenu />
      <AdminTable
        tableButtons={[
          <SearchBar submitHandler={handleSearchSubmit} />,
          <AdminTableAddButton label={"Add Admin"} />,
        ]}
        tableFields={tableFields}
        rows={admins}
        isLoading={isLoading}
        error={error}
        renderRow={(admin, index) => (
          <TableRow key={admin.userId} hover sx={{ width: "100%" }}>
            <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
            <TableCell>{admin.userName}</TableCell>
            <TableCell>{admin.email}</TableCell>
            <TableCell>{roles[admin.role]}</TableCell>
            <TableCell>
              {new Date(admin.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>(Coming Soon)*</TableCell>
          </TableRow>
        )}
      />
    </Box>
  );
}

export default ManageAdminPage;
