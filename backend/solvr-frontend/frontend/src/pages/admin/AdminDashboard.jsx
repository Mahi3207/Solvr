import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import DifficultyBadge from "../../components/ui/DifficultyBadge";
import { adminService } from "../../services/adminService";
import { problemService } from "../../services/problemService";
import { topicService } from "../../services/topicService";
import { roadmapService } from "../../services/roadmapService";
import { toErrorMessage } from "../../api/apiClient";
import { formatDate } from "../../utils/formatters";

export default function AdminDashboard() {
  const [state, setState] = useState({ loading: true, error: "" });
  const [users, setUsers] = useState([]);
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setState({ loading: true, error: "" });
      try {
        const [u, p, t, r] = await Promise.all([
          adminService.getAllUsers(),
          problemService.getAll(),
          topicService.getAll(),
          roadmapService.getAll(),
        ]);
        if (!mounted) return;
        setUsers(u || []);
        setProblems(p || []);
        setTopics(t || []);
        setRoadmaps(r || []);
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
        <LoadingSpinner label="Loading control center…" />
      </div>
    );
  }

  if (state.error) {
    return (
      <>
        <Topbar title="Admin dashboard" />
        <ErrorState message={state.error} />
      </>
    );
  }

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  const recentProblems = [...problems]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <Topbar
        title="Control center"
        subtitle="A live snapshot of everything happening on Solvr."
      />
      <div
        style={{
          padding: "0 32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          <StatTile
            icon="👥"
            label="Total users"
            value={users.length}
            to="/admin/users"
            color="var(--pathway)"
          />
          <StatTile
            icon="🧩"
            label="Total problems"
            value={problems.length}
            to="/admin/problems"
            color="var(--ember-dark)"
          />
          <StatTile
            icon="📚"
            label="Total topics"
            value={topics.length}
            to="/admin/topics"
            color="var(--violet)"
          />
          <StatTile
            icon="🗺️"
            label="Total roadmaps"
            value={roadmaps.length}
            to="/admin/roadmaps"
            color="var(--easy)"
          />
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}
        >
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <h3 style={{ fontSize: 16 }}>Recent users</h3>
              <Link
                to="/admin/users"
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "var(--pathway)",
                }}
              >
                Manage users →
              </Link>
            </div>
            {recentUsers.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                No users yet.
              </p>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {recentUsers.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13.5,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                        {u.email}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                      {formatDate(u.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <h3 style={{ fontSize: 16 }}>Recently added problems</h3>
              <Link
                to="/admin/problems"
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "var(--pathway)",
                }}
              >
                Manage problems →
              </Link>
            </div>
            {recentProblems.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                No problems yet.
              </p>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {recentProblems.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 13.5,
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <DifficultyBadge difficulty={p.difficulty} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>
            Problem distribution by difficulty
          </h3>
          <DifficultyDistribution problems={problems} />
        </Card>
      </div>
    </>
  );
}

function StatTile({ icon, label, value, to, color }) {
  return (
    <Link to={to}>
      <Card
        hoverable
        style={{ display: "flex", flexDirection: "column", gap: 6 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 600 }}
          >
            {label}
          </span>
          <span style={{ fontSize: 18 }}>{icon}</span>
        </div>
        <div className="mono" style={{ fontSize: 30, fontWeight: 700, color }}>
          {value}
        </div>
      </Card>
    </Link>
  );
}

function DifficultyDistribution({ problems }) {
  const counts = { EASY: 0, MEDIUM: 0, HARD: 0 };
  problems.forEach((p) => {
    if (counts[p.difficulty] !== undefined) counts[p.difficulty] += 1;
  });
  const total = problems.length || 1;
  const bars = [
    { key: "EASY", color: "var(--easy)", label: "Easy" },
    { key: "MEDIUM", color: "var(--medium)", label: "Medium" },
    { key: "HARD", color: "var(--hard)", label: "Hard" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {bars.map((b) => (
        <div
          key={b.key}
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <div style={{ width: 70, fontSize: 13, fontWeight: 600 }}>
            {b.label}
          </div>
          <div
            style={{
              flex: 1,
              height: 10,
              background: "var(--border-soft)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${(counts[b.key] / total) * 100}%`,
                height: "100%",
                background: b.color,
              }}
            />
          </div>
          <div
            className="mono"
            style={{
              width: 30,
              textAlign: "right",
              fontSize: 12.5,
              color: "var(--ink-soft)",
            }}
          >
            {counts[b.key]}
          </div>
        </div>
      ))}
    </div>
  );
}
