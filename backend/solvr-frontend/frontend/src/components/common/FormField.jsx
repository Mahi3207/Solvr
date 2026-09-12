export default function FormField({ label, error, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 6, color: "var(--ink)" }}>
          {label} {required && <span style={{ color: "var(--danger)" }}>*</span>}
        </label>
      )}
      {children}
      {error && <div style={{ color: "var(--danger)", fontSize: 12.5, marginTop: 4 }}>{error}</div>}
    </div>
  );
}
