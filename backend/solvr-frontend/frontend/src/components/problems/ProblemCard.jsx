import { Link } from "react-router-dom";
import Card from "../common/Card";
import DifficultyBadge from "../ui/DifficultyBadge";
import TopicBadge from "../ui/TopicBadge";
import StatusBadge from "../ui/StatusBadge";

export default function ProblemCard({ problem, status }) {
  return (
    <Link to={`/app/problems/${problem.id}`}>
      <Card hoverable style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <h4 style={{ fontSize: 15.5, lineHeight: 1.35 }}>{problem.title}</h4>
          {problem.premium && <span title="Premium" style={{ fontSize: 15 }}>⭐</span>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <DifficultyBadge difficulty={problem.difficulty} />
          {problem.topicName && <TopicBadge name={problem.topicName} />}
          {status && <StatusBadge status={status} />}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 6 }}>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{problem.platform}</span>
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
            ~{problem.estimatedTime}m
          </span>
        </div>
      </Card>
    </Link>
  );
}
