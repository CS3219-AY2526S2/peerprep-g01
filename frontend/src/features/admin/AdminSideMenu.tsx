import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import logo from "../../assets/peerprep-logo-nobg.png";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import ConfirmDialog from "../../components/ConfirmDialog";

const DRAWER_WIDTH = 250;

function AdminSideMenu() {
  const theme = useTheme();
  const isCollapsed = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navItems = [
    {
      text: "Manage Admins",
      icon: <AdminPanelSettingsOutlinedIcon />,
      path: "/admin/manage-admin",
    },
    {
      text: "Question Bank",
      icon: <DescriptionOutlinedIcon />,
      path: "/admin/manage-question",
    },
    {
      text: "User Directory",
      icon: <ManageAccountsIcon />,
      path: "/admin/manage-user",
    },
    {
      text: "Active Rooms",
      icon: <MeetingRoomIcon />,
      path: "/admin/manage-room",
    },
  ];

  return (
    <Drawer
      sx={{
        width: isCollapsed ? theme.spacing(9) : DRAWER_WIDTH,
        flexShrink: 0,
        transition: theme.transitions.create("width"),
        "& .MuiDrawer-paper": {
          width: isCollapsed ? theme.spacing(9) : DRAWER_WIDTH,
          boxSizing: "border-box",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: theme.transitions.create("width"),
        },
      }}
      variant="permanent"
      anchor="left"
    >
      {!isCollapsed && (
        <img
          src={logo}
          alt="logo icon"
          style={{
            width: "70%",
            maxWidth: 200,
            filter: "invert(20%)",
            padding: theme.spacing(3, 0, 0, 2),
          }}
        />
      )}

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ px: 1 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname == item.path}
              sx={{
                justifyContent: isCollapsed ? "center" : "flex-start",
                minHeight: 48,
              }}
            >
              <ListItemIcon sx={{ minWidth: isCollapsed ? "unset" : 40 }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List>
        <ListItem disablePadding sx={{ px: 1 }}>
          <ListItemButton
            onClick={() => setLogoutOpen(true)}
            sx={{
              justifyContent: isCollapsed ? "center" : "flex-start",
              minHeight: 48,
            }}
          >
            <ListItemIcon sx={{ minWidth: isCollapsed ? "unset" : 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Logout" />}
          </ListItemButton>
        </ListItem>
      </List>
      <ConfirmDialog
        open={logoutOpen}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmLabel="Logout"
        confirmColor="error"
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </Drawer>
  );
}

export default AdminSideMenu;
