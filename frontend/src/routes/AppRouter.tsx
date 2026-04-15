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
import ManageUserPage from "../pages/admin/ManageUserPage";
import ManageAdminPage from "../pages/admin/ManageAdminPage";
import ManageQuestionPage from "../pages/admin/ManageQuestionPage";
import ManageRoomPage from "../pages/admin/ManageRoomPage";
import useAuthStore from "../store/authStore";
import CollabPage from "../pages/CollabPage";

function UserLayout() {
  const user = useAuthStore.getState().user;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function AdminLayout() {
  const user = useAuthStore.getState().user;
  if (!user) return <Navigate to="/login" replace />;
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
          <Route path="session/:roomId" element={<CollabPage />}></Route>
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
