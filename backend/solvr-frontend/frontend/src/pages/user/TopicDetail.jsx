import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import ProgressBar from "../../components/common/ProgressBar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import ProblemCard from "../../components/problems/ProblemCard";
import MasteryRing from "../../components/dashboard/MasteryRing";
import { topicService } from "../../services/topicService";
import { problemService } from "../../services/problemService";
import { dashboardService } from "../../services/dashboardService";
import { activityService } from "../../services/activityService";
import { toErrorMessage } from "../../api/apiClient";

export default function TopicDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: "" });
  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [statusByProblem, setStatusByProblem] = useState({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      setState({ loading: true, error: "" });
      try {
        const [t, allProblems, topicAnalytics, activities] = await Promise.all([
          topicService.getById(id),
          problemService.getAll(),
          dashboardService.getTopicAnalytics().catch(() => []),
          activityService.getMine().catch(() => []),
        ]);
        if (!mounted) return;
        setTopic(t);
        setProblems(
          (allProblems || []).filter((p) => String(p.topicId) === String(id)),
        );
        setAnalytics(
          (topicAnalytics || []).find(
            (a) => String(a.topicId) === String(id),
          ) || null,
        );
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
            to="/app/topics"
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
          gap: 20,
        }}
      >
        <Card
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <MasteryRing
            percent={analytics?.averageMastery ?? 0}
            label="Avg. mastery"
            color="var(--violet)"
          />
          <div style={{ flex: 1, minWidth: 220 }}>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-soft)",
                marginBottom: 12,
              }}
            >
              {topic.description || "No description available for this topic."}
            </p>
            <ProgressBar
              value={analytics?.completionPercentage ?? 0}
              max={100}
            />
            <div
              style={{
                display: "flex",
                gap: 18,
                marginTop: 10,
                fontSize: 12.5,
                color: "var(--ink-soft)",
              }}
            >
              <span>{analytics?.totalProblems ?? problems.length} total</span>
              <span>{analytics?.attemptedProblems ?? 0} attempted</span>
              <span>{analytics?.solvedProblems ?? 0} solved</span>
            </div>
          </div>
        </Card>

        <div>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>
            Problems in this topic
          </h3>
          {problems.length === 0 ? (
            <EmptyState
              icon="🧩"
              title="No problems yet"
              subtitle="Problems for this topic will show up here once added."
            />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {problems.map((p) => (
                <ProblemCard
                  key={p.id}
                  problem={p}
                  status={statusByProblem[p.id]}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
