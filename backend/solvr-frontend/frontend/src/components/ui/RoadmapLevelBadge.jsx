import Badge from "../common/Badge";
import { ROADMAP_LEVEL_META } from "../../utils/constants";

export default function RoadmapLevelBadge({ level }) {
  const meta = ROADMAP_LEVEL_META[level] || { label: level, color: "var(--ink)", bg: "var(--border-soft)" };
  return <Badge color={meta.color} bg={meta.bg}>{meta.label}</Badge>;
}
