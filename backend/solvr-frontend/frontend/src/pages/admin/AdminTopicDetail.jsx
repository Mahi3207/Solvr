import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Badge from "../../components/common/Badge";
import DifficultyBadge from "../../components/ui/DifficultyBadge";
import { topicService } from "../../services/topicService";
import { problemService } from "../../services/problemService";
import { toErrorMessage } from "../../api/apiClient";

export default function AdminTopicDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: "" });
  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setState({ loading: true, error: "" });
      try {
        const [t, allProblems] = await Promise.all([
          topicService.getById(id),
          problemService.getAll(),
        ]);
        if (!mounted) return;
        setTopic(t);
        setProblems(
          (allProblems || []).filter((p) => String(p.topicId) === String(id)),
        );
        setState({ loading: false, error: "" });
      } catch (err) {
        if (mounted) setState({ loading: false, error: toErrorMessage(err) });
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (state.loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <LoadingSpinner label="Loading topic…" />
      </div>
    );
  }
  if (state.error || !topic) {
    return (
      <>
        <Topbar title="Topic" />
        <ErrorState message={state.error || "Topic not found."} />
      </>
    );
  }

  return (
    <>
      <Topbar
        title={topic.name}
        subtitle={
          <Link
            to="/admin/topics"
            style={{ color: "var(--pathway)", fontWeight: 600 }}
          >
            ← Back to topics
          </Link>
        }
      />
      <div
        style={{
          padding: "0 32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <Card>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <Badge
              color={topic.active ? "var(--easy)" : "var(--ink-soft)"}
              bg={topic.active ? "var(--easy-bg)" : "var(--border-soft)"}
            >
              {topic.active ? "Active" : "Inactive"}
            </Badge>
            <Badge>Order #{topic.displayOrder}</Badge>
          </div>
          <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>
            {topic.description || "No description."}
          </p>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15.5, marginBottom: 14 }}>
            Problems in this topic ({problems.length})
          </h3>
          {problems.length === 0 ? (
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
              No problems assigned to this topic yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {problems.map((p) => (
                <Link
                  key={p.id}
                  to={`/admin/problems/${p.id}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 4px",
                    fontSize: 13.5,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{p.title}</span>
                  <DifficultyBadge difficulty={p.difficulty} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
