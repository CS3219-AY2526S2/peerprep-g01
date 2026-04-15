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

interface AdminTableProps<T> {
  tableButtons?: React.ReactNode[];
  tableFields?: string[];
  rows?: T[];
  isLoading?: boolean;
  error?: string | null;
  renderRow: (item: T, index: number) => React.ReactNode;
}

function AdminTable<T>({
  tableButtons = [],
  tableFields = [],
  rows = [],
  isLoading = false,
  error = null,
  renderRow,
}: AdminTableProps<T>) {
  const renderBody = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={tableFields.length} align="center">
            <CircularProgress size={28} />
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={tableFields.length} align="center">
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
          <TableCell colSpan={tableFields.length} align="center">
            <Typography variant="body2" color="textSecondary">
              No available entries.
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((item, index) => (
      <React.Fragment key={index}>{renderRow(item, index)}</React.Fragment>
    ));
  };

  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "grey.100",
        p: 3,
        display: "flex",
        justifyContent: "flex-start",
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
            flexWrap: "wrap",
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
        <TableContainer sx={{ flex: 1, overflowX: "auto" }}>
          <Table sx={{ "& td": { px: 2 } }}>
            {/*Header*/}
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                {tableFields.map((item, index) => (
                  <TableCell
                    key={index}
                    sx={{ fontWeight: 500, py: 1, px: 2, whiteSpace: "nowrap" }}
                  >
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
