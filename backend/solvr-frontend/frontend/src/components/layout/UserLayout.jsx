import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const items = [
  { to: "/app/dashboard", label: "Dashboard", icon: "🏠", end: true },
  { to: "/app/problems", label: "Problems", icon: "🧩" },
  { to: "/app/topics", label: "Topics", icon: "📚" },
  { to: "/app/roadmaps", label: "Roadmaps", icon: "🗺️" },
  { to: "/app/revision", label: "Revision", icon: "🔁" },
  { to: "/app/bookmarks",label: "Bookmarks", icon: "🔖",},
{to: "/app/favourites",label: "Favourites",icon: "❤️",},
{ to: "/app/analytics", label: "Analytics", icon: "📊" },
  { to: "/app/profile", label: "Profile", icon: "👤" },
  
];

export default function UserLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar items={items} footerLabel="Solvr · Learner workspace" />
      <main style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </main>
    </div>
  );
}
