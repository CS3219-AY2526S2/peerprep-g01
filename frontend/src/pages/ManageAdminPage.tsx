import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AdminSideMenu from "../components/AdminSideMenu";

function ManageAdminPage() {
  return (

    // ROOT — flex row puts sidebar + content side by side
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>

      {/* SIDEBAR — your existing component */}
      <AdminSideMenu />

      {/* MAIN CONTENT — flex:1 takes all remaining space */}
      <Box sx={{ flex: 1, bgcolor: "grey.100", p: 3, display: "flex", justifyContent: "flex-end", alignContent: "center" }}>

        {/* WHITE CARD */}
        <Box sx={{
          bgcolor: "white",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          width: "100%",
          maxWidth: 1200,
          height: "95vh",
          display: "flex",
          flexDirection: "column",
        }}>
            {/*Top Card(button) */}
          <Box sx ={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "grey.200",
          }}>
            <Button
                size="medium"
                variant="contained"
                startIcon={<AddIcon/>}
                sx={{ bgcolor: "#1e293b", borderRadius: 2, fontSize: 10, textTransform: "none" }}
            >
                Add Admin
            </Button>
          </Box>
          {/*Table content */}
          <TableContainer sx={{flex: 1}}>
            <Table>
                {/*Header*/}
                <TableHead>
                    <TableRow sx={{bgcolor: "grey.50"}}>
                    <TableCell sx={{fontWeight: 500, width: 30, py: 1 }}>#</TableCell>
                    <TableCell sx={{fontWeight: 500, width: 150, py: 1}}>Full Name</TableCell>
                    <TableCell sx={{fontWeight: 500, width: 220, py: 1}}>Email</TableCell>
                    <TableCell sx={{fontWeight: 500, width: 120, py: 1}}>Role</TableCell>
                    <TableCell sx={{fontWeight: 500, width: 160, py: 1}}>Joined Date</TableCell>
                    <TableCell sx={{fontWeight: 500, width: 100, py: 1}}>Status</TableCell>
                    <TableCell sx={{fontWeight: 500, width: 120, py: 1}}/>
                    </TableRow>
                </TableHead>
                {/*Table Body */}
                <TableBody>
                    
                </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default ManageAdminPage;
