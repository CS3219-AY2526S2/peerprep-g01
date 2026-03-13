import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Typography,
} from "@mui/material";
import React from "react";
import type User from "../../types/user";

const roleLabel: Record<string, string> = {
  "1": "User",
  "2": "Admin",
  "3": "SuperAdmin",
};

interface AdminTableProps {
  tableButtons?: React.ReactNode[];
  tableFields?: string[];
  rows?: User[];
  isLoading?: boolean;
  error?: string | null;
}

function AdminTable({
  tableButtons = [],
  tableFields = [],
  rows = [],
  isLoading = false,
  error = null,
}: AdminTableProps) {
  const renderBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={tableFields.length} align="center" sx={{ py: 6 }}>
            <CircularProgress size={28} />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={tableFields.length} align="center" sx={{ py: 6 }}>
            <Typography variant="body2" color="error">
              {`Error message: ${error}`}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={tableFields.length} align="center" sx={{ py: 6 }}>
            <Typography variant="body2" color="textSecondary">
              No available entries.
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((user) => (
      <TableRow key={user.userId} hover>
        <TableCell>{user.userId}</TableCell>
        <TableCell>{user.userName}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{roleLabel[user.role] ?? user.role}</TableCell>
      </TableRow>
    ));
  };

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "grey.100",
        p: 3,
        display: "flex",
        justifyContent: "flex-end",
        alignContent: "center",
      }}
    >
      {/* WHITE CARD */}
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          width: "100%",
          maxWidth: 1200,
          height: "95vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/*Top Card(button) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 2,
            p: 2,
            borderBottom: "1px solid",
            borderColor: "grey.200",
          }}
        >
          {tableButtons.map((item: React.ReactNode, index: number) => (
            <React.Fragment key={index}>{item}</React.Fragment>
          ))}
        </Box>
        {/*Table content */}
        <TableContainer sx={{ flex: 1 }}>
          <Table>
            {/*Header*/}
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                {tableFields.map((item, index) => (
                  <TableCell key={index} sx={{ fontWeight: 500, py: 1 }}>
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {/*Table Body */}
            <TableBody>{renderBody()}</TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default AdminTable;
