import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import ProgressBar from "../../components/common/ProgressBar";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import WelcomeCard from "../../components/dashboard/WelcomeCard";
import StatCard from "../../components/dashboard/StatCard";
import MasteryRing from "../../components/dashboard/MasteryRing";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { dashboardService } from "../../services/dashboardService";
import { revisionService } from "../../services/revisionService";
import { activityService } from "../../services/activityService";
import { toErrorMessage } from "../../api/apiClient";
import { round, formatRelativeDate } from "../../utils/formatters";

export default function Dashboard() {
  const { user } = useAuth();

  const [state, setState] = useState({
    loading: true,
    error: "",
  });

  const [dashboard, setDashboard] = useState(null);
  const [topics, setTopics] = useState([]);
  const [todayRevisions, setTodayRevisions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setState({ loading: true, error: "" });

      try {
        const [dash, topicList, revisions, activities] = await Promise.all([
          dashboardService.getDashboard(),
          dashboardService.getTopicAnalytics().catch(() => []),
          revisionService.getToday().catch(() => []),
          activityService.getMine().catch(() => []),
        ]);

        if (!mounted) return;

        setDashboard(dash);
        setTopics(topicList || []);
        setTodayRevisions(revisions || []);

        const sorted = [...(activities || [])].sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt),
        );

        setRecentActivity(sorted.slice(0, 5));
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

  if (state.loading) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner label="Loading your dashboard…" />
      </div>
    );
  }

  if (state.error) {
    return (
      <>
        <Topbar title="Dashboard" />
        <ErrorState message={state.error} />
      </>
    );
  }

  /*
   * COMPLETED = SOLVED + MASTERED
   *
   * Solved and Mastered remain separate status cards,
   * but both count toward overall learning progress.
   */
  const solvedProblems = dashboard?.solvedProblems ?? 0;
  const masteredProblems = dashboard?.masteredProblems ?? 0;
  const totalProblems = dashboard?.totalProblems ?? 0;

  const completedProblems = solvedProblems + masteredProblems;

  const overallProgress =
    totalProblems > 0 ? round((completedProblems / totalProblems) * 100, 1) : 0;

  const overallMastery = round(dashboard?.overallMastery ?? 0, 1);

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Here's where your DSA journey stands today."
      />

      <div
        style={{
          padding: "0 32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <WelcomeCard name={user?.name} />

        {/* Overview stat row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          <StatCard
            icon="✍️"
            label="Attempted"
            value={dashboard?.attemptedProblems ?? 0}
            accent="var(--medium)"
          />

          <StatCard
            icon="✅"
            label="Solved"
            value={solvedProblems}
            accent="var(--easy)"
          />

          <StatCard
            icon="🏆"
            label="Mastered"
            value={masteredProblems}
            accent="var(--pathway)"
          />

          <StatCard
            icon="○"
            label="Not Started"
            value={dashboard?.notStartedProblems ?? 0}
          />

          <StatCard
            icon="🔁"
            label="Revision due today"
            value={dashboard?.revisionDueToday ?? 0}
            accent="var(--ember-dark)"
            sub={
              dashboard?.revisionDueToday
                ? "Let's clear the queue"
                : "You're all caught up"
            }
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 18,
          }}
        >
          {/* Progress + mastery */}
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ fontSize: 16 }}>Overall progress</h3>

              <span
                className="mono"
                style={{
                  fontSize: 13,
                  color: "var(--ink-soft)",
                }}
              >
                {completedProblems} / {totalProblems} completed
              </span>
            </div>

            <ProgressBar value={overallProgress} max={100} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
                fontSize: 12.5,
                color: "var(--ink-soft)",
              }}
            >
              <span>{overallProgress}% complete</span>
            </div>

            {/* Topic progress */}
            <div
              style={{
                marginTop: 22,
                borderTop: "1px solid var(--border-soft)",
                paddingTop: 18,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  marginBottom: 14,
                }}
              >
                Topic progress
              </h3>

              {topics.length === 0 ? (
                <EmptyState
                  icon="📚"
                  title="No topic data yet"
                  subtitle="Solve a few problems to see topic-wise progress here."
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {topics.slice(0, 6).map((t) => {
                    /*
                     * Topic completed progress =
                     * SOLVED + MASTERED
                     */
                    const topicSolved = t.solvedProblems ?? 0;

                    const topicMastered = t.masteredProblems ?? 0;

                    const topicCompleted = topicSolved + topicMastered;

                    const topicTotal = t.totalProblems ?? 0;

                    const topicProgress =
                      topicTotal > 0
                        ? round((topicCompleted / topicTotal) * 100, 1)
                        : 0;

                    return (
                      <div key={t.topicId}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 13.5,
                            marginBottom: 5,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            {t.topicName}
                          </span>

                          <span
                            className="mono"
                            style={{
                              color: "var(--ink-soft)",
                            }}
                          >
                            {topicCompleted}/{topicTotal}
                          </span>
                        </div>

                        <ProgressBar
                          value={topicProgress}
                          max={100}
                          height={8}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {topics.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <Link
                    to="/app/topics"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--pathway)",
                    }}
                  >
                    View all topics →
                  </Link>
                </div>
              )}
            </div>
          </Card>

          {/* Mastery + revision due */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <Card
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <MasteryRing
                percent={overallMastery}
                size={92}
                label="Overall mastery"
              />

              <div
                style={{
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  lineHeight: 1.5,
                }}
              >
                Mastery blends your confidence, retention, and consistency
                across attempts — logged each time you record a problem review.
              </div>
            </Card>

            <Card>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <h3 style={{ fontSize: 16 }}>Revision due today</h3>

                <Link
                  to="/app/revision"
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "var(--pathway)",
                  }}
                >
                  Open queue →
                </Link>
              </div>

              {todayRevisions.length === 0 ? (
                <EmptyState
                  icon="🎉"
                  title="Nothing due today"
                  subtitle="Enjoy the clear queue — check back tomorrow."
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {todayRevisions.slice(0, 4).map((r) => (
                    <div
                      key={r.activityId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 13.5,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                        }}
                      >
                        {r.problemTitle}
                      </span>

                      <span
                        className="mono"
                        style={{
                          color: "var(--ink-soft)",
                          fontSize: 12,
                        }}
                      >
                        {r.revisionCount}x revised
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {todayRevisions.length > 0 && (
                <Button
                  size="sm"
                  variant="ember"
                  style={{
                    marginTop: 14,
                    width: "100%",
                  }}
                >
                  <Link to="/app/revision" style={{ color: "inherit" }}>
                    Start revision session
                  </Link>
                </Button>
              )}
            </Card>
          </div>
        </div>

        {/* Continue learning / recent activity */}
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <h3 style={{ fontSize: 16 }}>Continue learning</h3>

            <Link
              to="/app/problems"
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: "var(--pathway)",
              }}
            >
              Browse problems →
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <EmptyState
              icon="🚀"
              title="No activity yet"
              subtitle="Solve your first problem and it'll show up here so you can pick up right where you left off."
              action={
                <Button size="sm">
                  <Link to="/app/problems" style={{ color: "inherit" }}>
                    Find a problem
                  </Link>
                </Button>
              }
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {recentActivity.map((a) => (
                <Link
                  key={a.id}
                  to={`/app/problems/${a.problemId}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 8px",
                    borderRadius: 10,
                    fontSize: 13.5,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--border-soft)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{a.problemTitle}</div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--ink-soft)",
                      }}
                    >
                      Updated {formatRelativeDate(a.updatedAt || a.createdAt)}
                    </div>
                  </div>

                  <StatusBadge status={a.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
