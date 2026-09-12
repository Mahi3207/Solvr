export default function LoadingSpinner({ label = "Loading…", size = 28 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: 24 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--pathway)",
          animation: "spin 0.8s linear infinite",
        }}
      />
      {label && <span style={{ color: "var(--ink-soft)", fontSize: 14 }}>{label}</span>}
    </div>
  );
}
