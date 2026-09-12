export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  const btnStyle = (active) => ({
    minWidth: 32,
    height: 32,
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: active ? "var(--pathway)" : "var(--paper-raised)",
    color: active ? "white" : "var(--ink)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  });

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
      <button style={btnStyle(false)} disabled={page === 1} onClick={() => onChange(page - 1)}>
        ‹
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} style={{ padding: "0 4px", color: "var(--ink-soft)" }}>
            …
          </span>
        ) : (
          <button key={p} style={btnStyle(p === page)} onClick={() => onChange(p)}>
            {p}
          </button>
        )
      )}
      <button style={btnStyle(false)} disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        ›
      </button>
    </div>
  );
}
