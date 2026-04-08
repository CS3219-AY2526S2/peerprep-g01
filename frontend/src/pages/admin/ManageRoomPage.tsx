import { Box } from "@mui/material";
import AdminSideMenu from "../../features/admin/AdminSideMenu";
import AdminTable from "../../features/admin/AdminTable";
import SearchBar from "../../components/SearchBar";

const tableFields = [
  "Room-ID",
  "UserOne",
  "UserTwo",
  "Topic",
  "Difficulty",
  "Question",
  "Status",
];

function ManageRoomPage() {
  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <AdminSideMenu />
      <AdminTable tableButtons={[<SearchBar />]} tableFields={tableFields} />
    </Box>
  );
}

export default ManageRoomPage;
