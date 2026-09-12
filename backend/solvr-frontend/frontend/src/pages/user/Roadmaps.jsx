import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import RoadmapLevelBadge from "../../components/ui/RoadmapLevelBadge";
import { roadmapService } from "../../services/roadmapService";
import { toErrorMessage } from "../../api/apiClient";

export default function Roadmaps() {
  const [state, setState] = useState({ loading: true, error: "" });
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    let mounted = true;
    roadmapService
      .getAll()
      .then((data) => {
        if (mounted) {
          setRoadmaps((data || []).filter((r) => r.active !== false));
          setState({ loading: false, error: "" });
        }
      })
      .catch(
        (err) =>
          mounted && setState({ loading: false, error: toErrorMessage(err) }),
      );
    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <LoadingSpinner label="Loading roadmaps…" />
      </div>
    );
  }

  return (
    <>
      <Topbar
        title="Roadmaps"
        subtitle="Guided learning paths, ordered problem by problem."
      />
      <div style={{ padding: "0 32px 40px" }}>
        {state.error ? (
          <ErrorState message={state.error} />
        ) : roadmaps.length === 0 ? (
          <EmptyState
            icon="🗺️"
            title="No roadmaps published yet"
            subtitle="Check back soon — an admin is putting one together."
          />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {roadmaps.map((r) => (
              <Link key={r.id} to={`/app/roadmaps/${r.id}`}>
                <Card
                  hoverable
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <h4 style={{ fontSize: 16.5 }}>{r.title}</h4>
                    <RoadmapLevelBadge level={r.level} />
                  </div>
                  {r.description && (
                    <p
                      style={{
                        fontSize: 13.5,
                        color: "var(--ink-soft)",
                        lineHeight: 1.5,
                      }}
                    >
                      {r.description}
                    </p>
                  )}
                  <div
                    style={{
                      marginTop: "auto",
                      fontSize: 12.5,
                      color: "var(--ink-soft)",
                    }}
                  >
                    ⏱ ~{r.estimatedDuration} days
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
