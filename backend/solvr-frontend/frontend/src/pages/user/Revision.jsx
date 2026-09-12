import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import Badge from "../../components/common/Badge";
import { revisionService } from "../../services/revisionService";
import { toErrorMessage } from "../../api/apiClient";
import { formatDateTime } from "../../utils/formatters";

const TABS = [
  { key: "overdue", label: "Overdue", icon: "⏰" },
  { key: "today", label: "Due today", icon: "🔁" },
  { key: "upcoming", label: "Upcoming", icon: "🗓️" },
];

export default function Revision() {
  const [tab, setTab] = useState("today");
  const [data, setData] = useState({
    overdue: [],
    today: [],
    upcoming: [],
  });
  const [state, setState] = useState({
    loading: true,
    error: "",
  });

  useEffect(() => {
    let mounted = true;

    async function load(showLoading = false) {
      if (showLoading) {
        setState({
          loading: true,
          error: "",
        });
      }

      try {
        const [overdue, today, upcoming] = await Promise.all([
          revisionService.getOverdue(),
          revisionService.getToday(),
          revisionService.getUpcoming(),
        ]);

        if (!mounted) return;

        setData({
          overdue: overdue || [],
          today: today || [],
          upcoming: upcoming || [],
        });

        setState({
          loading: false,
          error: "",
        });
      } catch (err) {
        if (!mounted) return;

        setState({
          loading: false,
          error: toErrorMessage(err),
        });
      }
    }

    // Initial load
    load(true);

    // Refresh every 60 seconds so revisions automatically
    // move from "Due today" to "Overdue" when their time passes.
    const interval = setInterval(() => {
      load(false);
    }, 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
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
        <LoadingSpinner label="Loading your revision queue…" />
      </div>
    );
  }

  const items = data[tab] || [];

  return (
    <>
      <Topbar
        title="Revision"
        subtitle="Spaced repetition keeps problems from fading — revisit them on schedule."
      />

      <div style={{ padding: "0 32px 40px" }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 22,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 16px",
                borderRadius: 999,
                border: "1px solid var(--border)",
                background:
                  tab === t.key ? "var(--ink)" : "var(--paper-raised)",
                color: tab === t.key ? "white" : "var(--ink)",
                fontSize: 13.5,
                fontWeight: 600,
              }}
            >
              <span>{t.icon}</span>

              {t.label}

              <Badge
                bg={
                  tab === t.key
                    ? "rgba(255,255,255,0.15)"
                    : "var(--border-soft)"
                }
                color={tab === t.key ? "white" : "var(--ink-soft)"}
              >
                {data[t.key]?.length ?? 0}
              </Badge>
            </button>
          ))}
        </div>

        {state.error ? (
          <ErrorState message={state.error} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={tab === "today" ? "🎉" : tab === "overdue" ? "✨" : "🗓️"}
            title={
              tab === "today"
                ? "Your revision queue is empty 🎉"
                : tab === "overdue"
                  ? "Nothing overdue — great job staying on top of it"
                  : "No upcoming revisions scheduled"
            }
          />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {items.map((r) => (
              <Link key={r.activityId} to={`/app/problems/${r.problemId}`}>
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
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      {r.problemTitle}
                    </div>

                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--ink-soft)",
                        marginTop: 3,
                      }}
                    >
                      Revised {r.revisionCount}x · Next:{" "}
                      {formatDateTime(r.nextRevisionDate)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    {r.masteryScore != null && (
                      <span
                        className="mono"
                        style={{
                          fontSize: 12.5,
                          color: "var(--violet)",
                          fontWeight: 700,
                        }}
                      >
                        {Math.round(r.masteryScore)}% mastery
                      </span>
                    )}

                    {r.needRevision && (
                      <Badge color="var(--ember-dark)" bg="var(--ember-light)">
                        Needs revision
                      </Badge>
                    )}
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
