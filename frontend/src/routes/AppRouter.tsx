import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "../pages/SignUpPage";
import Login from "../pages/LoginPage";
import UserHomePage from "../pages/UserHomePage";
import UserDirectoryPage from "../pages/UserDirectoryPage";
import ManageAdminPage from "../pages/ManageAdminPage";
import ManageQuestionPage from "../pages/ManageQuestionPage";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<SignUp />} />

        <Route path="/home" element={<UserHomePage />} />

        <Route path="/admin/user-directory" element={<UserDirectoryPage />} />

        <Route path="/manage-admin" element={<ManageAdminPage />} />

        <Route path="/manage-question" element={<ManageQuestionPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
