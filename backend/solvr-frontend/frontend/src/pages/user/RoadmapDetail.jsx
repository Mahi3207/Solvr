import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import RoadmapLevelBadge from "../../components/ui/RoadmapLevelBadge";
import StatusBadge from "../../components/ui/StatusBadge";
import { roadmapService } from "../../services/roadmapService";
import { roadmapProblemService } from "../../services/roadmapProblemService";
import { activityService } from "../../services/activityService";
import { toErrorMessage } from "../../api/apiClient";

export default function RoadmapDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: "" });
  const [roadmap, setRoadmap] = useState(null);
  const [stages, setStages] = useState([]);
  const [statusByProblem, setStatusByProblem] = useState({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      setState({ loading: true, error: "" });
      try {
        const [r, problemLinks, activities] = await Promise.all([
          roadmapService.getById(id),
          roadmapProblemService.getByRoadmap(id),
          activityService.getMine().catch(() => []),
        ]);
        if (!mounted) return;
        setRoadmap(r);
        const sorted = [...(problemLinks || [])].sort(
          (a, b) => a.displayOrder - b.displayOrder,
        );
        setStages(sorted);
        const map = {};
        (activities || []).forEach((a) => (map[a.problemId] = a.status));
        setStatusByProblem(map);
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
        <LoadingSpinner label="Loading roadmap…" />
      </div>
    );
  }

  if (state.error || !roadmap) {
    return (
      <>
        <Topbar title="Roadmap" />
        <ErrorState message={state.error || "Roadmap not found."} />
      </>
    );
  }

  const doneCount = stages.filter((s) =>
    ["SOLVED", "MASTERED"].includes(statusByProblem[s.problemId]),
  ).length;
  const currentIndex = stages.findIndex(
    (s) => !["SOLVED", "MASTERED"].includes(statusByProblem[s.problemId]),
  );

  return (
    <>
      <Topbar
        title={roadmap.title}
        subtitle={
          <Link
            to="/app/roadmaps"
            style={{ color: "var(--pathway)", fontWeight: 600 }}
          >
            ← Back to roadmaps
          </Link>
        }
      />
      <div
        style={{
          padding: "0 32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Card
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <RoadmapLevelBadge level={roadmap.level} />
          <span style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
            {roadmap.description}
          </span>
          <span
            className="mono"
            style={{
              marginLeft: "auto",
              fontSize: 13,
              color: "var(--ink-soft)",
            }}
          >
            {doneCount}/{stages.length} stages complete
          </span>
        </Card>

        {stages.length === 0 ? (
          <EmptyState icon="🧭" title="No problems added to this roadmap yet" />
        ) : (
          <div style={{ position: "relative", paddingLeft: 26 }}>
            <div
              style={{
                position: "absolute",
                left: 9,
                top: 10,
                bottom: 10,
                width: 2,
                background:
                  "repeating-linear-gradient(to bottom, var(--border) 0 6px, transparent 6px 12px)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {stages.map((s, i) => {
                const status = statusByProblem[s.problemId];
                const done = ["SOLVED", "MASTERED"].includes(status);
                const isCurrent = i === currentIndex;
                return (
                  <div key={s.id} style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: -26,
                        top: 18,
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: done
                          ? "var(--easy)"
                          : isCurrent
                            ? "var(--ember)"
                            : "var(--border)",
                        border: "3px solid var(--paper)",
                      }}
                    />
                    <Link to={`/app/problems/${s.problemId}`}>
                      <Card
                        hoverable
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "var(--ink-soft)",
                              marginBottom: 3,
                            }}
                          >
                            Stage {s.displayOrder}
                          </div>
                          <div style={{ fontWeight: 600, fontSize: 15 }}>
                            {s.problemTitle}
                          </div>
                        </div>
                        <StatusBadge status={status || "NOT_STARTED"} />
                      </Card>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
