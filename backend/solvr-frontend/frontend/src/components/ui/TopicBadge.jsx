import Badge from "../common/Badge";

export default function TopicBadge({ name }) {
  if (!name) return null;
  return <Badge color="var(--pathway-dark)" bg="var(--pathway-light)">{name}</Badge>;
}
