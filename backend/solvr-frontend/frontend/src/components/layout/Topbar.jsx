import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { initials } from "../../utils/formatters";
import { useToast } from "../common/Toast";

export default function Topbar({ title, subtitle, right }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out. See you tomorrow!");
      navigate("/login");
    } catch {
      toast.error("Couldn't log out cleanly, but your session was cleared.");
      navigate("/login");
    }
  }

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 32px 10px",
        gap: 16,
      }}
    >
      <div>
        <h1 style={{ fontSize: 24 }}>{title}</h1>
        {subtitle && <p style={{ color: "var(--ink-soft)", fontSize: 14, marginTop: 4 }}>{subtitle}</p>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {right}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--paper-raised)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              padding: "6px 14px 6px 6px",
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "var(--pathway)",
                color: "white",
                display: "grid",
                placeItems: "center",
                fontSize: 12.5,
                fontWeight: 700,
              }}
            >
              {initials(user?.name)}
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{user?.name?.split(" ")[0]}</span>
          </button>

          {menuOpen && (
            <div
              onMouseLeave={() => setMenuOpen(false)}
              style={{
                position: "absolute",
                right: 0,
                top: "calc(100% + 8px)",
                background: "var(--paper-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--shadow-md)",
                minWidth: 170,
                overflow: "hidden",
                zIndex: 50,
              }}
            >
              <MenuItem
                label="Profile"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(user?.role === "ADMIN" ? "/admin/dashboard" : "/app/profile");
                }}
              />
              <MenuItem label="Log out" danger onClick={handleLogout} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "10px 14px",
        fontSize: 13.5,
        fontWeight: 500,
        background: "transparent",
        border: "none",
        color: danger ? "var(--danger)" : "var(--ink)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border-soft)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {label}
    </button>
  );
}
