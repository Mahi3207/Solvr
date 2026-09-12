export default function RowActions({ onView, onEdit, onDelete }) {
  const btn = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    padding: "4px 8px",
    borderRadius: 6,
  };
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {onView && (
        <button style={{ ...btn, color: "var(--pathway)" }} onClick={onView}>
          View
        </button>
      )}
      {onEdit && (
        <button style={{ ...btn, color: "var(--ink)" }} onClick={onEdit}>
          Edit
        </button>
      )}
      {onDelete && (
        <button style={{ ...btn, color: "var(--danger)" }} onClick={onDelete}>
          Delete
        </button>
      )}
    </div>
  );
}
