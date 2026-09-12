export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--paper)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 64px",
        }}
        className="fade-up"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
          <span style={{ fontSize: 28 }}>🧭</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22 }}>Solvr</span>
        </div>
        <div style={{ maxWidth: 380, width: "100%" }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>{title}</h1>
          {subtitle && <p style={{ color: "var(--ink-soft)", fontSize: 14.5, marginBottom: 28 }}>{subtitle}</p>}
          {children}
          {footer && <div style={{ marginTop: 22, fontSize: 13.5 }}>{footer}</div>}
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(160deg, var(--pathway-dark), var(--pathway) 60%, #0a4a44)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PathwayIllustration />
      </div>
    </div>
  );
}

function PathwayIllustration() {
  const nodes = [
    { x: 60, y: 320, label: "Arrays", done: true },
    { x: 160, y: 250, label: "Strings", done: true },
    { x: 130, y: 150, label: "Trees", done: true },
    { x: 250, y: 100, label: "Graphs", done: false },
    { x: 340, y: 180, label: "DP", done: false },
  ];
  const path = nodes.map((n) => `${n.x},${n.y}`).join(" ");

  return (
    <svg viewBox="0 0 420 420" width="82%" style={{ maxWidth: 420 }}>
      <polyline
        points={path}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="3"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.done ? 10 : 8} fill={n.done ? "#f59e0b" : "rgba(255,255,255,0.25)"} stroke="white" strokeWidth={n.done ? 0 : 1.5} />
          <text x={n.x} y={n.y - 18} fill="white" fontSize="13" fontFamily="Sora, sans-serif" fontWeight="600" textAnchor="middle" opacity="0.9">
            {n.label}
          </text>
        </g>
      ))}
      <text x="210" y="400" fill="white" fontSize="15" fontFamily="Sora, sans-serif" fontWeight="700" textAnchor="middle" opacity="0.85">
        Every problem is a step on the path.
      </text>
    </svg>
  );
}
