import Card from "../common/Card";

export default function StatCard({ icon, label, value, sub, accent = "var(--pathway)" }) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: accent }}>{value}</div>
      {sub && <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{sub}</div>}
    </Card>
  );
}
