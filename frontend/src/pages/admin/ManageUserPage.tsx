import {
  Box,
  CircularProgress,
  IconButton,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminSideMenu from "../../features/admin/AdminSideMenu";
import AdminTable from "../../features/admin/AdminTable";
import SearchBar from "../../components/SearchBar";
import useUsers from "../../hooks/useUsers";
import { useEffect, useState } from "react";
import type User from "../../types/user";

function ManageUserPage() {
  const tableFields = [
    "#",
    "UserName",
    "Email",
    "JoinedDate",
    "QuestionsCompleted",
    "",
  ];

  const {
    users,
    isLoading,
    error,
    loadUsers,
    cursorOffset,
    deleteUser,
    deletingUserId,
    searchUsers,
  } = useUsers();

  const [confirmTarget, setConfirmTarget] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  function handleDeleteClick(user: User) {
    setConfirmTarget(user);
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    await deleteUser(confirmTarget.userId);
    setConfirmTarget(null);
  }

  function handleCancelDelete() {
    setConfirmTarget(null);
  }

  async function handleSearchSubmit(keyword: string) {
    await searchUsers(keyword);
  }

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <AdminSideMenu />
      <AdminTable
        tableButtons={[<SearchBar submitHandler={handleSearchSubmit} />]}
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
            <TableCell align="right">
              {deletingUserId === user.userId ? (
                <CircularProgress size={20} />
              ) : (
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(user)}
                  aria-label={`Delete ${user.userName}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        )}
      />

      <Dialog open={!!confirmTarget} onClose={handleCancelDelete}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{confirmTarget?.userName}</strong> ({confirmTarget?.email})?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={!!deletingUserId}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageUserPage;
