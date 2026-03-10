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
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 250;

function AdminSideMenu() {
  const theme = useTheme();
  const isCollapsed = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      text: "Manage Admins",
      icon: <AdminPanelSettingsOutlinedIcon />,
      path: "/admin/manage-admins",
    },
    {
      text: "Question Bank",
      icon: <DescriptionOutlinedIcon />,
      path: "/admin/question-bank",
    },
    {
      text: "User Directory",
      icon: <ManageAccountsIcon />,
      path: "/admin/user-directory",
    },
    {
      text: "Active Rooms",
      icon: <MeetingRoomIcon />,
      path: "/admin/active-rooms",
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

      <List>
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
    </Drawer>
  );
}

export default AdminSideMenu;
