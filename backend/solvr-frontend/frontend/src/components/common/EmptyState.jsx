export default function EmptyState({ icon = "🧭", title = "Nothing here yet", subtitle, action }) {
  return (
    <div
      className="fade-up"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 6,
        padding: "48px 20px",
        color: "var(--ink-soft)",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--ink)" }}>{title}</div>
      {subtitle && <div style={{ fontSize: 14, maxWidth: 360 }}>{subtitle}</div>}
      {action && <div style={{ marginTop: 10 }}>{action}</div>}
    </div>
  );
}
