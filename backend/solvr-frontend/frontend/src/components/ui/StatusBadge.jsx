import Badge from "../common/Badge";
import { STATUS_META } from "../../utils/constants";

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { label: status, color: "var(--ink)", bg: "var(--border-soft)" };
  return <Badge color={meta.color} bg={meta.bg}>{meta.label}</Badge>;
}
