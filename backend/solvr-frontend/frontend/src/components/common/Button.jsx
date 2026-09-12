export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  style,
  ...rest
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    borderRadius: "var(--radius-sm)",
    border: "1px solid transparent",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.6 : 1,
    transition: "transform 0.12s ease, box-shadow 0.12s ease, background 0.15s ease",
    whiteSpace: "nowrap",
  };

  const sizes = {
    sm: { padding: "6px 12px", fontSize: 13 },
    md: { padding: "10px 18px", fontSize: 14.5 },
    lg: { padding: "13px 22px", fontSize: 16 },
  };

  const variants = {
    primary: { background: "var(--pathway)", color: "white", boxShadow: "var(--shadow-sm)" },
    ember: { background: "var(--ember)", color: "#3a2405", boxShadow: "var(--shadow-sm)" },
    secondary: { background: "var(--paper-raised)", color: "var(--ink)", border: "1px solid var(--border)" },
    ghost: { background: "transparent", color: "var(--ink)" },
    danger: { background: "var(--danger)", color: "white" },
    outline: { background: "transparent", color: "var(--pathway)", border: "1px solid var(--pathway)" },
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseDown={(e) => { if (!disabled && !loading) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: "2px solid currentColor",
        borderTopColor: "transparent",
        display: "inline-block",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}
