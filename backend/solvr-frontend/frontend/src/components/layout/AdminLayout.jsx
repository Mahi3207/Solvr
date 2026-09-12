import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "🛰️", end: true },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/problems", label: "Problems", icon: "🧩" },
  { to: "/admin/topics", label: "Topics", icon: "📚" },
  { to: "/admin/roadmaps", label: "Roadmaps", icon: "🗺️" },
  { to: "/admin/companies", label: "Companies", icon: "🏢" },
  { to: "/admin/tags", label: "Tags", icon: "🏷️" },
];

export default function AdminLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar items={items} footerLabel="Solvr · Control center" />
      <main style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
