import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import React from "react";

interface AdminTableProps {
  tableButtons?: React.ReactNode[];
  tableFields?: string[];
}

function AdminTable({ tableButtons = [], tableFields = [] }: AdminTableProps) {
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
            <TableBody></TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default AdminTable;
