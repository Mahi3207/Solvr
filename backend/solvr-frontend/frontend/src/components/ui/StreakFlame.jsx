export default function StreakFlame({ count = 0, size = 22 }) {
  const active = count > 0;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: size,
        animation: active ? "pulseFlame 1.6s ease-in-out infinite" : "none",
        filter: active ? "none" : "grayscale(1) opacity(0.4)",
      }}
    >
      🔥
    </span>
  );
}
