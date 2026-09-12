import StreakFlame from "../ui/StreakFlame";

const MESSAGES = [
  "Small steps, every day, add up to mastery.",
  "One more problem is one more step on the path.",
  "Consistency beats intensity. Keep going.",
  "Your future self is thanking you already.",
];

export default function WelcomeCard({ name, streak }) {
  const msg = MESSAGES[new Date().getDate() % MESSAGES.length];
  return (
    <div
      className="fade-up"
      style={{
        background: "linear-gradient(135deg, var(--pathway-dark), var(--pathway))",
        borderRadius: "var(--radius-lg)",
        padding: "26px 28px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2 style={{ fontSize: 23, color: "white" }}>Welcome back, {name?.split(" ")[0]} 👋</h2>
        <p style={{ opacity: 0.85, fontSize: 14.5, marginTop: 6 }}>{msg}</p>
      </div>
      {streak !== undefined && (
        <div
          style={{
            background: "rgba(255,255,255,0.14)",
            borderRadius: 16,
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <StreakFlame count={streak} size={26} />
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{streak}</div>
            <div style={{ fontSize: 11.5, opacity: 0.8 }}>day streak</div>
          </div>
        </div>
      )}
    </div>
  );
}
