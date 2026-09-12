import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";
import FormField from "../../components/common/FormField";
import { inputStyle } from "../../components/common/inputStyle";
import Button from "../../components/common/Button";
import AdminToolbar from "../../components/admin/AdminToolbar";
import DataTable from "../../components/admin/DataTable";
import RowActions from "../../components/admin/RowActions";
import RoadmapLevelBadge from "../../components/ui/RoadmapLevelBadge";
import { roadmapService } from "../../services/roadmapService";
import { toErrorMessage } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";

const emptyForm = {
  title: "",
  description: "",
  level: "BEGINNER",
  estimatedDuration: 30,
  active: true,
};

export default function AdminRoadmaps() {
  const toast = useToast();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: "" });
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setState({ loading: true, error: "" });
    try {
      const data = await roadmapService.getAll();
      setItems(data || []);
      setState({ loading: false, error: "" });
    } catch (err) {
      setState({ loading: false, error: toErrorMessage(err) });
    }
  }
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.title.toLowerCase().includes(q));
  }, [items, search]);

  function openAdd() {
    setForm(emptyForm);
    setModal({ mode: "add" });
  }
  function openEdit(item) {
    setForm({
      title: item.title,
      description: item.description || "",
      level: item.level,
      estimatedDuration: item.estimatedDuration,
      active: item.active,
    });
    setModal({ mode: "edit", item });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      estimatedDuration: Number(form.estimatedDuration),
    };
    try {
      if (modal.mode === "add") {
        const { active, ...createPayload } = payload;
        const created = await roadmapService.create(createPayload);
        setItems((i) => [...i, created]);
        toast.success("Roadmap created.");
      } else {
        const updated = await roadmapService.update(modal.item.id, payload);
        setItems((i) => i.map((x) => (x.id === updated.id ? updated : x)));
        toast.success("Roadmap updated.");
      }
      setModal(null);
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await roadmapService.remove(pendingDelete.id);
      setItems((i) => i.filter((x) => x.id !== pendingDelete.id));
      toast.success("Roadmap deleted.");
      setPendingDelete(null);
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  if (state.loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <LoadingSpinner label="Loading roadmaps…" />
      </div>
    );
  }

  return (
    <>
      <Topbar title="Roadmaps" subtitle={`${items.length} learning paths`} />
      <div style={{ padding: "0 32px 40px" }}>
        <AdminToolbar
          search={search}
          onSearch={setSearch}
          onAdd={openAdd}
          addLabel="Add roadmap"
        />
        {state.error ? (
          <ErrorState message={state.error} onRetry={load} />
        ) : (
          <Card style={{ padding: 0 }}>
            <DataTable
              rows={filtered}
              emptyMessage="No roadmaps match your search."
              columns={[
                {
                  key: "title",
                  header: "Title",
                  render: (r) => (
                    <Link
                      to={`/admin/roadmaps/${r.id}`}
                      style={{ fontWeight: 600, color: "var(--pathway-dark)" }}
                    >
                      {r.title}
                    </Link>
                  ),
                },
                {
                  key: "level",
                  header: "Level",
                  render: (r) => <RoadmapLevelBadge level={r.level} />,
                },
                {
                  key: "estimatedDuration",
                  header: "Duration",
                  render: (r) => `${r.estimatedDuration} days`,
                },
                {
                  key: "actions",
                  header: "",
                  render: (r) => (
                    <RowActions
                      onView={() => navigate(`/admin/roadmaps/${r.id}`)}
                      onEdit={() => openEdit(r)}
                      onDelete={() => setPendingDelete(r)}
                    />
                  ),
                },
              ]}
            />
          </Card>
        )}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === "add" ? "Add roadmap" : "Edit roadmap"}
        width={480}
      >
        <form onSubmit={handleSave}>
          <FormField label="Title" required>
            <input
              required
              maxLength={255}
              style={inputStyle}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </FormField>
          <FormField label="Description">
            <textarea
              style={{ ...inputStyle, minHeight: 70 }}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </FormField>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <FormField label="Level" required>
              <select
                style={inputStyle}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </FormField>
            <FormField label="Est. duration (days)" required>
              <input
                type="number"
                min={1}
                required
                style={inputStyle}
                value={form.estimatedDuration}
                onChange={(e) =>
                  setForm({ ...form, estimatedDuration: e.target.value })
                }
              />
            </FormField>
          </div>
          {modal?.mode === "edit" && (
            <FormField label="Status">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13.5,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                />{" "}
                Active
              </label>
            </FormField>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 16,
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModal(null)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this roadmap?"
        message={`"${pendingDelete?.title}" and its stage list will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
