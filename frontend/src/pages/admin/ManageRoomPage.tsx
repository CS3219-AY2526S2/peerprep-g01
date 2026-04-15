import { useState } from "react";
import { Box, TableRow, TableCell, Typography } from "@mui/material";
import AdminSideMenu from "../../features/admin/AdminSideMenu";
import AdminTable from "../../features/admin/AdminTable";
import SearchBar from "../../components/SearchBar";
import ViewRoomDialog from "../../features/admin/ViewRoomDialog";
import { type Room } from "../../services/roomService";
import useRoom from "../../hooks/useRoom";
import ChipAttribute from "../../components/ChipAttribute";
import { green, orange, red, grey } from "@mui/material/colors";
import type { Color } from "@mui/material";

const TABLE_FIELDS = [
  "Room-ID",
  "User One",
  "User Two",
  "Question",
  "Topic",
  "Difficulty",
];

const DIFFICULTY_COLOR: Record<string, Color> = {
  Easy: green,
  Medium: orange,
  Hard: red,
};

function ManageRoomPage() {
  const { rooms, isLoading, error, handleSearch } = useRoom();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  function renderRow(room: Room) {
    return (
      <TableRow key={room.roomId} hover sx={{ cursor: "default" }}>
        <TableCell>{room.roomId}</TableCell>

        <TableCell>{room.userOneId}</TableCell>

        <TableCell>{room.userTwoId}</TableCell>

        <TableCell>
          <Typography variant="body2" noWrap sx={{ maxWidth: 220 }}>
            {room.question.questionName}
          </Typography>
        </TableCell>

        <TableCell>
          <ChipAttribute label={room.question.topicName} color={grey} />
        </TableCell>

        <TableCell>
          <ChipAttribute
            label={
              room.question.difficulty.charAt(0).toUpperCase() +
              room.question.difficulty.slice(1)
            }
            color={DIFFICULTY_COLOR[room.question.difficulty] ?? grey}
          />
        </TableCell>
      </TableRow>
    );
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
        tableButtons={[<SearchBar submitHandler={handleSearch} />]}
        tableFields={TABLE_FIELDS}
        rows={rooms}
        isLoading={isLoading}
        error={error}
        renderRow={renderRow}
      />
      <ViewRoomDialog
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </Box>
  );
}

export default ManageRoomPage;
