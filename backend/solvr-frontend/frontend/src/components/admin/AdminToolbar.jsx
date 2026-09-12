import SearchBar from "../common/SearchBar";
import Button from "../common/Button";

export default function AdminToolbar({ search, onSearch, onAdd, addLabel = "Add new", right }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18, flexWrap: "wrap" }}>
      <SearchBar value={search} onChange={onSearch} placeholder="Search…" style={{ flex: "1 1 240px" }} />
      {right}
      {onAdd && <Button onClick={onAdd}>+ {addLabel}</Button>}
    </div>
  );
}
