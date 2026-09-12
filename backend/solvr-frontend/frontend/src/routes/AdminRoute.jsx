import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Route-level guard: a USER can never render an /admin/* page, even by
// typing the URL directly. This is a UX/navigation guard only — the
// backend's @PreAuthorize("hasRole('ADMIN')") remains the real authority.
export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <LoadingSpinner label="Checking permissions…" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/app/dashboard" replace />;

  return <Outlet />;
}
