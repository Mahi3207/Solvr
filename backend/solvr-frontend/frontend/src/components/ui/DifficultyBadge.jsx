import Badge from "../common/Badge";
import { DIFFICULTY_META } from "../../utils/constants";

export default function DifficultyBadge({ difficulty }) {
  const meta = DIFFICULTY_META[difficulty] || { label: difficulty, color: "var(--ink)", bg: "var(--border-soft)" };
  return <Badge color={meta.color} bg={meta.bg}>{meta.label}</Badge>;
}
