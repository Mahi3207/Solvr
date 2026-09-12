import { NavLink } from "react-router-dom";

export default function Sidebar({ items, footerLabel }) {
  return (
    <aside
      style={{
        width: 236,
        flexShrink: 0,
        background: "var(--ink)",
        color: "#eceaf7",
        display: "flex",
        flexDirection: "column",
        padding: "22px 14px",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 10px", marginBottom: 30 }}>
        <span style={{ fontSize: 24 }}>🧭</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 19, letterSpacing: "-0.02em" }}>
          Solvr
        </span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "10px 14px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              color: isActive ? "#15182b" : "#c7c5da",
              background: isActive ? "#f0ede3" : "transparent",
              transition: "background 0.15s ease, color 0.15s ease",
            })}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {footerLabel && (
        <div style={{ fontSize: 11.5, color: "#7f7d94", padding: "10px 12px", borderTop: "1px solid #2b2e45" }}>
          {footerLabel}
        </div>
      )}
    </aside>
  );
}
