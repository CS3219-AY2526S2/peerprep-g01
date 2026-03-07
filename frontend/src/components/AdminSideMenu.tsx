import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useNavigate } from "react-router-dom";

function AdminSideMenu() {
  const navigate = useNavigate();
  const navItems = [
    { text: "Manage Admins", icon: <AdminPanelSettingsOutlinedIcon />, path: "/manage-admin"},
    { text: "Question Bank", icon: <DescriptionOutlinedIcon />, path: "/manage-question"},
    { text: "User Directory", icon: <ManageAccountsIcon />, path: "/user-directory" },
    { text: "Active Rooms", icon: <MeetingRoomIcon />, path: "" },
  ];

  return (
    <Drawer
      sx={{
        width: 300,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 300,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default AdminSideMenu;
