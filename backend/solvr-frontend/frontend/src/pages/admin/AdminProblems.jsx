import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AdminToolbar from "../../components/admin/AdminToolbar";
import DataTable from "../../components/admin/DataTable";
import RowActions from "../../components/admin/RowActions";
import DifficultyBadge from "../../components/ui/DifficultyBadge";
import { inputStyle } from "../../components/common/inputStyle";
import { problemService } from "../../services/problemService";
import { topicService } from "../../services/topicService";
import { toErrorMessage } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";

export default function AdminProblems() {
  const toast = useToast();
  const navigate = useNavigate();

  const [state, setState] = useState({ loading: true, error: "" });
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setState({ loading: true, error: "" });

    try {
      const [p, t] = await Promise.all([
        problemService.getAll(),
        topicService.getAll(),
      ]);

      setProblems(p || []);
      setTopics(t || []);
      setState({ loading: false, error: "" });
    } catch (err) {
      setState({
        loading: false,
        error: toErrorMessage(err),
      });
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...problems];

    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (difficulty !== "ALL") {
      list = list.filter((p) => p.difficulty === difficulty);
    }

    return list.sort((a, b) => b.id - a.id);
  }, [problems, search, difficulty]);

  async function handleDelete() {
    setDeleting(true);

    try {
      await problemService.remove(pendingDelete.id);

      setProblems((p) => p.filter((x) => x.id !== pendingDelete.id));

      toast.success("Problem deleted.");
      setPendingDelete(null);
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  if (state.loading) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          height: "100vh",
        }}
      >
        <LoadingSpinner label="Loading problems…" />
      </div>
    );
  }

  return (
    <>
      <Topbar
        title="Problems"
        subtitle={`${problems.length} problems in the catalog`}
      />

      <div style={{ padding: "0 32px 40px" }}>
        <AdminToolbar
          search={search}
          onSearch={setSearch}
          onAdd={() => navigate("/admin/problems/new")}
          addLabel="Add problem"
          right={
            <select
              style={{ ...inputStyle, width: 150 }}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="ALL">All difficulty</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          }
        />

        {state.error ? (
          <ErrorState message={state.error} onRetry={load} />
        ) : (
          <Card style={{ padding: 0 }}>
            <DataTable
              rows={filtered}
              emptyMessage="No problems match your filters."
              columns={[
                {
                  key: "title",
                  header: "Title",
                  render: (p) => (
                    <Link
                      to={`/admin/problems/${p.id}`}
                      style={{
                        fontWeight: 600,
                        color: "var(--pathway-dark)",
                      }}
                    >
                      {p.title}
                    </Link>
                  ),
                },

                {
                  key: "difficulty",
                  header: "Difficulty",
                  render: (p) => <DifficultyBadge difficulty={p.difficulty} />,
                },

                {
                  key: "topicName",
                  header: "Topic",
                },

                {
                  key: "platform",
                  header: "Platform",
                },

                {
                  key: "actions",
                  header: "",
                  render: (p) => (
                    <RowActions
                      onView={() => navigate(`/admin/problems/${p.id}`)}
                      onEdit={() => navigate(`/admin/problems/${p.id}/edit`)}
                      onDelete={() => setPendingDelete(p)}
                    />
                  ),
                },
              ]}
            />
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this problem?"
        message={`"${pendingDelete?.title}" will be permanently removed, including its associations with roadmaps and companies.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
