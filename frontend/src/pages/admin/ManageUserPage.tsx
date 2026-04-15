import {
  Alert,
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
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminSideMenu from "../../features/admin/AdminSideMenu";
import AdminTable from "../../features/admin/AdminTable";
import SearchBar from "../../components/SearchBar";
import useUsers from "../../hooks/useUsers";
import { useEffect, useState } from "react";
import type User from "../../types/user";
import UserHistoryDialog from "../../features/admin/UserHistoryDialog";
import useUserHistory from "../../hooks/useUserHistory";

function ManageUserPage() {
  const tableFields = [
    "#",
    "UserName",
    "Email",
    "JoinedDate",
    "AttempyHistory",
    "",
  ];

  const {
    users,
    isLoading,
    error,
    loadUsers,
    cursorOffset,
    hasMore,
    loadNextUsers,
    deleteUser,
    deletingUserId,
    searchUsers,
  } = useUsers();

  const {
    history,
    isLoading: historyLoading,
    error: historyError,
    loadHistory,
    clearHistory,
  } = useUserHistory();

  const [confirmTarget, setConfirmTarget] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [historyTarget, setHistoryTarget] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  function handleDeleteClick(user: User) {
    setDeleteError(null);
    setConfirmTarget(user);
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    try {
      await deleteUser(confirmTarget.userId);
      setConfirmTarget(null);
    } catch (err) {
      if (err instanceof Error) setDeleteError(err.message);
      else setDeleteError("Failed to delete user.");
    }
  }

  function handleCancelDelete() {
    setConfirmTarget(null);
    setDeleteError(null);
  }

  function handleHistoryClick(user: User) {
    setHistoryTarget(user);
    loadHistory(user.userId);
  }

  function handleHistoryClose() {
    setHistoryTarget(null);
    clearHistory();
  }

  async function handleSearchSubmit(keyword: string) {
    await searchUsers(keyword);
  }

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <AdminSideMenu />
      <AdminTable
        tableButtons={[<SearchBar submitHandler={handleSearchSubmit} />]}
        tableFields={tableFields}
        rows={users}
        isLoading={isLoading}
        error={error}
        pagination={{
          canPrev: false,
          canNext: hasMore,
          onNext: loadNextUsers,
        }}
        renderRow={(user, index) => (
          <TableRow key={user.userId} hover sx={{ width: "100%" }}>
            <TableCell>{cursorOffset + index + 1}</TableCell>
            <TableCell>{user.userName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
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
                onClick={() => handleHistoryClick(user)}
              >
                View History
              </Button>
            </TableCell>
            <TableCell>
              {deletingUserId === user.userId ? (
                <CircularProgress size={20} sx={{ mx: "6px", my: "auto" }} />
              ) : (
                <Tooltip title="Delete user">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(user)}
                    aria-label={`Delete ${user.userName}`}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
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
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
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

      {/* History dialog */}
      <UserHistoryDialog
        open={!!historyTarget}
        userName={historyTarget?.userName ?? ""}
        history={history}
        isLoading={historyLoading}
        error={historyError}
        onClose={handleHistoryClose}
      />
    </Box>
  );
}

export default ManageUserPage;
