export default function Badge({ children, color = "var(--ink)", bg = "var(--border-soft)", style }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.01em",
        color,
        background: bg,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
