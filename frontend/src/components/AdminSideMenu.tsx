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

function AdminSideMenu() {
  const navItems = [
    { text: "Manage Admins", icon: <AdminPanelSettingsOutlinedIcon /> },
    { text: "Question Bank", icon: <DescriptionOutlinedIcon /> },
    { text: "User Directory", icon: <ManageAccountsIcon /> },
    { text: "Active Rooms", icon: <MeetingRoomIcon /> },
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
            <ListItemButton>
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
