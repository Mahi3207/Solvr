import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import MasteryRing from "../../components/dashboard/MasteryRing";
import StatCard from "../../components/dashboard/StatCard";
import { dashboardService } from "../../services/dashboardService";
import { activityService } from "../../services/activityService";
import { toErrorMessage } from "../../api/apiClient";
import { round } from "../../utils/formatters";

export default function Analytics() {
  const [state, setState] = useState({ loading: true, error: "" });
  const [dashboard, setDashboard] = useState(null);
  const [topics, setTopics] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setState({ loading: true, error: "" });

      try {
        const [dash, topicAnalytics, acts] = await Promise.all([
          dashboardService.getDashboard(),
          dashboardService.getTopicAnalytics().catch(() => []),
          activityService.getMine().catch(() => []),
        ]);

        if (!mounted) return;

        setDashboard(dash);
        setTopics(topicAnalytics || []);
        setActivities(acts || []);
        setState({ loading: false, error: "" });
      } catch (err) {
        if (mounted) {
          setState({
            loading: false,
            error: toErrorMessage(err),
          });
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const totalTimeSpent = useMemo(
    () => activities.reduce((sum, a) => sum + (a.timeSpent || 0), 0),
    [activities],
  );

  const avgConfidence = useMemo(() => {
    if (activities.length === 0) return 0;

    return round(
      activities.reduce((s, a) => s + (a.confidenceLevel || 0), 0) /
        activities.length,
      1,
    );
  }, [activities]);

  if (state.loading) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner label="Crunching your numbers…" />
      </div>
    );
  }

  if (state.error) {
    return (
      <>
        <Topbar title="Analytics" />
        <ErrorState message={state.error} />
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Analytics"
        subtitle="A closer look at how you learn, not just what you've solved."
      />

      <div
        style={{
          padding: "0 32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Analytics stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          <StatCard
            icon="🧩"
            label="Problems attempted"
            value={dashboard?.attemptedProblems ?? 0}
          />

          <StatCard
            icon="✅"
            label="Problems solved"
            value={dashboard?.solvedProblems ?? 0}
            accent="var(--easy)"
          />

          <StatCard
            icon="🏆"
            label="Problems mastered"
            value={dashboard?.masteredProblems ?? 0}
            accent="var(--pathway)"
          />

          <StatCard
            icon="⏱"
            label="Total time logged"
            value={`${totalTimeSpent}m`}
            accent="var(--medium)"
          />

          <StatCard
            icon="💪"
            label="Avg. confidence"
            value={`${avgConfidence}/5`}
            accent="var(--violet)"
          />
        </div>

        {/* Mastery by topic */}
        <Card>
          <h3
            style={{
              fontSize: 16,
              marginBottom: 16,
            }}
          >
            Mastery by topic
          </h3>

          {topics.length === 0 ? (
            <EmptyState icon="📊" title="No topic analytics yet" />
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 26,
              }}
            >
              {topics.map((t) => (
                <MasteryRing
                  key={t.topicId}
                  percent={t.averageMastery ?? 0}
                  size={78}
                  label={t.topicName}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
