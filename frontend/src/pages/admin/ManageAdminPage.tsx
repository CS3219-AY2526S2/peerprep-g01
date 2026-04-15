import {
  Box,
  CircularProgress,
  IconButton,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminSideMenu from "../../features/admin/AdminSideMenu";
import AdminTable from "../../features/admin/AdminTable";
import AdminTableAddButton from "../../components/RoundedFilledButton";
import SearchBar from "../../components/SearchBar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useAdmins from "../../hooks/useAdmin";
import useAuthStore from "../../store/authStore";
import { useEffect, useState } from "react";
import type User from "../../types/user";

function ManageAdminPage() {
  const tableFields = [
    "#",
    "User Name",
    "Email",
    "Role",
    "Joined Date",
    "",
  ];

  const roles: Record<string, string> = {
    "1": "User",
    "2": "Admin",
    "3": "Super Admin",
  };

  const {
    admins,
    isLoading,
    error,
    loadAdmins,
    page,
    createAdmin,
    deleteAdmin,
    deletingUserId,
    isCreating,
  } = useAdmins();

  const currentUser = useAuthStore((s) => s.user);
  const isSuperAdmin = currentUser?.role === "3";

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  function handleDeleteClick(admin: User) {
    setDeleteTarget(admin);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await deleteAdmin(deleteTarget.email, deleteTarget.userId);
    setDeleteTarget(null);
  }

  function handleOpenAdd() {
    setNewAdminEmail("");
    setAddError(null);
    setAddDialogOpen(true);
  }

  async function handleConfirmAdd() {
    const email = newAdminEmail.trim();
    if (!email) {
      setAddError("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAddError("Please enter a valid email address.");
      return;
    }
    try {
      await createAdmin(email);
      setAddDialogOpen(false);
    } catch (err) {
      if (err instanceof Error) setAddError(err.message);
    }
  }

  async function handleSearchSubmit() {}

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <AdminSideMenu />
      <AdminTable
        tableButtons={[
          <SearchBar submitHandler={handleSearchSubmit} />,
          ...(isSuperAdmin
            ? [<AdminTableAddButton label={"Add Admin"} onClick={handleOpenAdd} />]
            : []),
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
            <TableCell align="right">
              {!isSuperAdmin ||
              currentUser?.userId === admin.userId ? null : deletingUserId ===
                admin.userId ? (
                <CircularProgress size={20} />
              ) : (
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(admin)}
                  aria-label={`Delete ${admin.userName}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        )}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Admin"
        description={
          <>
            Are you sure you want to remove{" "}
            <strong>{deleteTarget?.userName}</strong> ({deleteTarget?.email}) as
            admin? Their role will be reverted to User.
          </>
        }
        confirmLabel="Delete"
        confirmColor="error"
        isLoading={!!deletingUserId}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Admin</DialogTitle>
        <DialogContent>
          {addError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addError}
            </Alert>
          )}
          <TextField
            autoFocus
            label="User email"
            type="email"
            fullWidth
            size="small"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmAdd}
            variant="contained"
            disabled={isCreating}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageAdminPage;
