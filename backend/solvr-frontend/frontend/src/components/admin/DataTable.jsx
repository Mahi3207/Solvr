export default function DataTable({ columns, rows, rowKey = "id", emptyMessage = "No data." }) {
  if (!rows || rows.length === 0) {
    return <div style={{ padding: 30, textAlign: "center", color: "var(--ink-soft)", fontSize: 13.5 }}>{emptyMessage}</div>;
  }
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  color: "var(--ink-soft)",
                  fontWeight: 600,
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  borderBottom: "1px solid var(--border)",
                  whiteSpace: "nowrap",
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[rowKey]} style={{ borderBottom: "1px solid var(--border-soft)" }}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
