import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import ProgressBar from "../../components/common/ProgressBar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import { topicService } from "../../services/topicService";
import { dashboardService } from "../../services/dashboardService";
import { toErrorMessage } from "../../api/apiClient";

export default function Topics() {
  const [state, setState] = useState({ loading: true, error: "" });
  const [topics, setTopics] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      setState({ loading: true, error: "" });
      try {
        const [topicList, topicAnalytics] = await Promise.all([
          topicService.getAll(),
          dashboardService.getTopicAnalytics().catch(() => []),
        ]);
        if (!mounted) return;
        setTopics((topicList || []).filter((t) => t.active !== false));
        const map = {};
        (topicAnalytics || []).forEach((a) => (map[a.topicId] = a));
        setAnalytics(map);
        setState({ loading: false, error: "" });
      } catch (err) {
        if (mounted) setState({ loading: false, error: toErrorMessage(err) });
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <LoadingSpinner label="Loading topics…" />
      </div>
    );
  }

  return (
    <>
      <Topbar
        title="Topics"
        subtitle="Every DSA topic tracked in Solvr, with your live progress."
      />
      <div style={{ padding: "0 32px 40px" }}>
        {state.error ? (
          <ErrorState message={state.error} />
        ) : topics.length === 0 ? (
          <EmptyState icon="📚" title="No topics available yet" />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {topics.map((t) => {
              const a = analytics[t.id];
              const pct = a?.completionPercentage ?? 0;
              return (
                <Link key={t.id} to={`/app/topics/${t.id}`}>
                  <Card
                    hoverable
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      height: "100%",
                    }}
                  >
                    <h4 style={{ fontSize: 16 }}>{t.name}</h4>
                    {t.description && (
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--ink-soft)",
                          lineHeight: 1.5,
                        }}
                      >
                        {t.description}
                      </p>
                    )}
                    <div style={{ marginTop: "auto" }}>
                      <ProgressBar value={pct} max={100} height={8} />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 6,
                          fontSize: 12,
                          color: "var(--ink-soft)",
                        }}
                      >
                        <span>
                          {a
                            ? `${a.solvedProblems}/${a.totalProblems} solved`
                            : "No progress yet"}
                        </span>
                        <span className="mono">{Math.round(pct)}%</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
