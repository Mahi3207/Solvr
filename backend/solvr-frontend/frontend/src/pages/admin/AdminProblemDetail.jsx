import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DifficultyBadge from "../../components/ui/DifficultyBadge";
import TopicBadge from "../../components/ui/TopicBadge";
import Badge from "../../components/common/Badge";
import { problemService } from "../../services/problemService";
import { toErrorMessage } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";
import { titleCase, formatDateTime } from "../../utils/formatters";

export default function AdminProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [state, setState] = useState({ loading: true, error: "" });
  const [problem, setProblem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setState({ loading: true, error: "" });
    try {
      const p = await problemService.getById(id);
      setProblem(p);
      setState({ loading: false, error: "" });
    } catch (err) {
      setState({ loading: false, error: toErrorMessage(err) });
    }
  }
  useEffect(() => {
    load();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await problemService.remove(id);
      toast.success("Problem deleted.");
      navigate("/admin/problems");
    } catch (err) {
      toast.error(toErrorMessage(err));
      setDeleting(false);
    }
  }

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
        <ErrorState message={state.error || "Problem not found."} />
      </>
    );
  }

  return (
    <>
      <Topbar
        title={problem.title}
        subtitle={
          <Link
            to="/admin/problems"
            style={{ color: "var(--pathway)", fontWeight: 600 }}
          >
            ← Back to problems
          </Link>
        }
        right={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/admin/problems/${id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          </>
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
            {problem.premium && (
              <Badge color="var(--ember-dark)" bg="var(--ember-light)">
                Premium
              </Badge>
            )}
            <Badge
              color={problem.active ? "var(--easy)" : "var(--ink-soft)"}
              bg={problem.active ? "var(--easy-bg)" : "var(--border-soft)"}
            >
              {problem.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p
            style={{
              fontSize: 14,
              color: "var(--ink-soft)",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {problem.description || "No description."}
          </p>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card>
            <h3 style={{ fontSize: 15, marginBottom: 12 }}>Metadata</h3>
            <MetaRow label="Slug" value={problem.slug} />
            <MetaRow label="Platform" value={titleCase(problem.platform)} />
            <MetaRow label="Est. time" value={`${problem.estimatedTime} min`} />
            <MetaRow
              label="URL"
              value={
                <a
                  href={problem.problemUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--pathway)" }}
                >
                  Open ↗
                </a>
              }
            />
            <MetaRow
              label="Created"
              value={formatDateTime(problem.createdAt)}
            />
            <MetaRow
              label="Updated"
              value={formatDateTime(problem.updatedAt)}
            />
          </Card>

          {problem.tags?.length > 0 && (
            <Card>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>Tags</h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {problem.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </Card>
          )}
          {problem.companies?.length > 0 && (
            <Card>
              <h3 style={{ fontSize: 15, marginBottom: 10 }}>Companies</h3>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {problem.companies.map((c) => (
                  <Badge key={c} color="var(--violet)" bg="var(--violet-light)">
                    {c}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this problem?"
        message={`"${problem.title}" will be permanently removed.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}

function MetaRow({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 13.5,
        padding: "6px 0",
        borderBottom: "1px solid var(--border-soft)",
      }}
    >
      <span style={{ color: "var(--ink-soft)" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
