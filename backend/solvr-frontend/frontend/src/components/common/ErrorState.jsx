import Button from "./Button";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 10,
        padding: "40px 20px",
        color: "var(--ink-soft)",
      }}
    >
      <div style={{ fontSize: 34 }}>⚠️</div>
      <div style={{ fontWeight: 600, color: "var(--ink)" }}>{message}</div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
