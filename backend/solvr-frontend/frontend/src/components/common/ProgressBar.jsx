export default function ProgressBar({ value = 0, max = 100, color = "var(--pathway)", trackColor = "var(--border-soft)", height = 10 }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div style={{ width: "100%", height, borderRadius: 999, background: trackColor, overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: 999,
          background: color,
          transition: "width 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}
