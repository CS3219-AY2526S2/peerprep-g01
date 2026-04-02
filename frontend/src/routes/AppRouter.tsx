import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import SignUp from "../pages/SignUpPage";
import Login from "../pages/LoginPage";
import UserHomePage from "../pages/UserHomePage";
import ManageUserPage from "../pages/ManageUserPage";
import ManageAdminPage from "../pages/ManageAdminPage";
import ManageQuestionPage from "../pages/ManageQuestionPage";
import ManageRoomPage from "../pages/ManageRoomPage";
import useAuthStore from "../store/authStore";

function UserLayout() {
  const token = useAuthStore.getState().token;
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AdminLayout() {
  const token = useAuthStore.getState().token;
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<UserLayout />}>
          <Route path="home" element={<UserHomePage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="manage-user" element={<ManageUserPage />} />
          <Route path="manage-admin" element={<ManageAdminPage />} />
          <Route path="manage-question" element={<ManageQuestionPage />} />
          <Route path="manage-room" element={<ManageRoomPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
