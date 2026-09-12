import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import UserLayout from "./components/layout/UserLayout";
import AdminLayout from "./components/layout/AdminLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/user/Dashboard";
import Problems from "./pages/user/Problems";
import ProblemDetail from "./pages/user/ProblemDetail";
import Topics from "./pages/user/Topics";
import TopicDetail from "./pages/user/TopicDetail";
import Roadmaps from "./pages/user/Roadmaps";
import RoadmapDetail from "./pages/user/RoadmapDetail";
import Revision from "./pages/user/Revision";
import Analytics from "./pages/user/Analytics";
import Profile from "./pages/user/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProblems from "./pages/admin/AdminProblems";
import AdminProblemDetail from "./pages/admin/AdminProblemDetail";
import AdminProblemForm from "./pages/admin/AdminProblemForm";
import AdminTopics from "./pages/admin/AdminTopics";
import AdminTopicDetail from "./pages/admin/AdminTopicDetail";
import AdminRoadmaps from "./pages/admin/AdminRoadmaps";
import AdminRoadmapDetail from "./pages/admin/AdminRoadmapDetail";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminTags from "./pages/admin/AdminTags";

import Bookmarks from "./pages/user/Bookmarks";
import Favourites from "./pages/user/Favourites";
import NotFound from "./pages/NotFound";
import LoadingSpinner from "./components/common/LoadingSpinner";

export default function App() {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <LoadingSpinner label="Starting Solvr…" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Root: send people somewhere sensible based on session state */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate
              to={isAdmin ? "/admin/dashboard" : "/app/dashboard"}
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* User application */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<UserLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="problems" element={<Problems />} />
          <Route path="problems/:id" element={<ProblemDetail />} />
          <Route path="topics" element={<Topics />} />
          <Route path="topics/:id" element={<TopicDetail />} />
          <Route path="roadmaps" element={<Roadmaps />} />
          <Route path="roadmaps/:id" element={<RoadmapDetail />} />
          <Route path="revision" element={<Revision />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Admin application — route-guarded, a USER can never render these */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="problems" element={<AdminProblems />} />
          <Route path="problems/new" element={<AdminProblemForm />} />
          <Route path="problems/:id" element={<AdminProblemDetail />} />
          <Route path="problems/:id/edit" element={<AdminProblemForm />} />
          <Route path="topics" element={<AdminTopics />} />
          <Route path="topics/:id" element={<AdminTopicDetail />} />
          <Route path="roadmaps" element={<AdminRoadmaps />} />
          <Route path="roadmaps/:id" element={<AdminRoadmapDetail />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="tags" element={<AdminTags />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
