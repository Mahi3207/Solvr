export default function SearchBar({ value, onChange, placeholder = "Search…", style }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "var(--paper-raised)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "9px 14px",
        ...style,
      }}
    >
      <span style={{ opacity: 0.5 }}>🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: "none", outline: "none", flex: 1, fontSize: 14, background: "transparent" }}
      />
    </div>
  );
}
