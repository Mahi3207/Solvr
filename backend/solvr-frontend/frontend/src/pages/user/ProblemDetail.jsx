import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import DifficultyBadge from "../../components/ui/DifficultyBadge";
import TopicBadge from "../../components/ui/TopicBadge";
import StatusBadge from "../../components/ui/StatusBadge";
import Badge from "../../components/common/Badge";
import LogActivityModal from "../../components/problems/LogActivityModal";
import { problemService } from "../../services/problemService";
import { activityService } from "../../services/activityService";
import { toErrorMessage } from "../../api/apiClient";
import { formatDateTime, titleCase } from "../../utils/formatters";

export default function ProblemDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: "" });
  const [problem, setProblem] = useState(null);
  const [activity, setActivity] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    setState({ loading: true, error: "" });
    try {
      const [p, activities] = await Promise.all([
        problemService.getById(id),
        activityService.getMine().catch(() => []),
      ]);
      setProblem(p);
      setActivity(
        (activities || []).find((a) => String(a.problemId) === String(id)) ||
          null,
      );
      setState({ loading: false, error: "" });
    } catch (err) {
      setState({ loading: false, error: toErrorMessage(err) });
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (state.loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <LoadingSpinner label="Loading problem…" />
      </div>
    );
  }

  if (state.error || !problem) {
    return (
      <>
        <Topbar title="Problem" />
        <ErrorState
          message={state.error || "Problem not found."}
          onRetry={load}
        />
      </>
    );
  }

  return (
    <>
      <Topbar
        title={problem.title}
        subtitle={
          <Link
            to="/app/problems"
            style={{ color: "var(--pathway)", fontWeight: 600 }}
          >
            ← Back to problems
          </Link>
        }
      />

      <div
        style={{
          padding: "0 32px 40px",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              <DifficultyBadge difficulty={problem.difficulty} />
              {problem.topicName && <TopicBadge name={problem.topicName} />}
              {activity && <StatusBadge status={activity.status} />}
              {problem.premium && (
                <Badge color="var(--ember-dark)" bg="var(--ember-light)">
                  Premium
                </Badge>
              )}
            </div>
            <p
              style={{
                fontSize: 14.5,
                lineHeight: 1.7,
                color: "var(--ink-soft)",
                whiteSpace: "pre-wrap",
              }}
            >
              {problem.description ||
                "No description provided for this problem."}
            </p>

            <div
              style={{
                display: "flex",
                gap: 20,
                marginTop: 18,
                flexWrap: "wrap",
                fontSize: 13,
              }}
            >
              <Meta label="Platform" value={titleCase(problem.platform)} />
              <Meta label="Est. time" value={`${problem.estimatedTime} min`} />
              {problem.problemUrl && (
                <a
                  href={problem.problemUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "var(--pathway)",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  Open on {titleCase(problem.platform)} ↗
                </a>
              )}
            </div>

            {(problem.tags?.length || problem.companies?.length) && (
              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {problem.tags?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12.5,
                        color: "var(--ink-soft)",
                        marginRight: 4,
                      }}
                    >
                      Tags:
                    </span>
                    {problem.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                )}
                {problem.companies?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12.5,
                        color: "var(--ink-soft)",
                        marginRight: 4,
                      }}
                    >
                      Asked by:
                    </span>
                    {problem.companies.map((c) => (
                      <Badge
                        key={c}
                        color="var(--violet)"
                        bg="var(--violet-light)"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card>
            <h3 style={{ fontSize: 15, marginBottom: 14 }}>Your progress</h3>
            {activity ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  fontSize: 13.5,
                }}
              >
                <Row
                  label="Status"
                  value={<StatusBadge status={activity.status} />}
                />
                <Row label="Attempts" value={activity.attemptCount} />
                <Row label="Time spent" value={`${activity.timeSpent} min`} />
                <Row
                  label="Confidence"
                  value={`${activity.confidenceLevel}/5`}
                />
                <Row
                  label="Mastery score"
                  value={
                    activity.masteryScore != null
                      ? `${Math.round(activity.masteryScore)}%`
                      : "Not calculated yet"
                  }
                />
                <Row
                  label="Next revision"
                  value={
                    activity.nextRevisionDate
                      ? formatDateTime(activity.nextRevisionDate)
                      : "—"
                  }
                />
                <Row
                  label="Last updated"
                  value={formatDateTime(activity.updatedAt)}
                />
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
                You haven't logged any activity for this problem yet.
              </p>
            )}
            <Button
              style={{ width: "100%", marginTop: 16 }}
              onClick={() => setModalOpen(true)}
            >
              {activity ? "Update progress" : "Mark attempted / solved"}
            </Button>
          </Card>

          {activity?.notes && (
            <Card>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>Your notes</h3>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--ink-soft)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {activity.notes}
              </p>
            </Card>
          )}
        </div>
      </div>

      <LogActivityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        problem={problem}
        existingActivity={activity}
        onSaved={() => load()}
      />
    </>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11.5,
          color: "var(--ink-soft)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ color: "var(--ink-soft)" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
