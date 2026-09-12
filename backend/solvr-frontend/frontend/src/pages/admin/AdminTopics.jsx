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
import Badge from "../../components/common/Badge";
import AdminToolbar from "../../components/admin/AdminToolbar";
import DataTable from "../../components/admin/DataTable";
import RowActions from "../../components/admin/RowActions";
import { topicService } from "../../services/topicService";
import { toErrorMessage } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";

const emptyForm = { name: "", description: "", displayOrder: 1, active: true };

export default function AdminTopics() {
  const toast = useToast();
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
      const data = await topicService.getAll();
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
    return items.filter((i) => i.name.toLowerCase().includes(q));
  }, [items, search]);

  function openAdd() {
    setForm({ ...emptyForm, displayOrder: items.length + 1 });
    setModal({ mode: "add" });
  }
  function openEdit(item) {
    setForm({
      name: item.name,
      description: item.description || "",
      displayOrder: item.displayOrder,
      active: item.active,
    });
    setModal({ mode: "edit", item });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, displayOrder: Number(form.displayOrder) };
    try {
      if (modal.mode === "add") {
        const { active, ...createPayload } = payload;
        const created = await topicService.create(createPayload);
        setItems((i) => [...i, created]);
        toast.success("Topic added.");
      } else {
        const updated = await topicService.update(modal.item.id, payload);
        setItems((i) => i.map((x) => (x.id === updated.id ? updated : x)));
        toast.success("Topic updated.");
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
      await topicService.remove(pendingDelete.id);
      setItems((i) => i.filter((x) => x.id !== pendingDelete.id));
      toast.success("Topic deleted.");
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
        <LoadingSpinner label="Loading topics…" />
      </div>
    );
  }

  return (
    <>
      <Topbar title="Topics" subtitle={`${items.length} DSA topics`} />
      <div style={{ padding: "0 32px 40px" }}>
        <AdminToolbar
          search={search}
          onSearch={setSearch}
          onAdd={openAdd}
          addLabel="Add topic"
        />
        {state.error ? (
          <ErrorState message={state.error} onRetry={load} />
        ) : (
          <Card style={{ padding: 0 }}>
            <DataTable
              rows={[...filtered].sort(
                (a, b) => a.displayOrder - b.displayOrder,
              )}
              emptyMessage="No topics match your search."
              columns={[
                { key: "displayOrder", header: "#" },
                {
                  key: "name",
                  header: "Name",
                  render: (t) => (
                    <Link
                      to={`/admin/topics/${t.id}`}
                      style={{ fontWeight: 600, color: "var(--pathway-dark)" }}
                    >
                      {t.name}
                    </Link>
                  ),
                },
                {
                  key: "description",
                  header: "Description",
                  render: (t) => (
                    <span style={{ color: "var(--ink-soft)" }}>
                      {t.description || "—"}
                    </span>
                  ),
                },
                {
                  key: "active",
                  header: "Status",
                  render: (t) => (
                    <Badge
                      color={t.active ? "var(--easy)" : "var(--ink-soft)"}
                      bg={t.active ? "var(--easy-bg)" : "var(--border-soft)"}
                    >
                      {t.active ? "Active" : "Inactive"}
                    </Badge>
                  ),
                },
                {
                  key: "actions",
                  header: "",
                  render: (t) => (
                    <RowActions
                      onView={() =>
                        window.location.assign(`/admin/topics/${t.id}`)
                      }
                      onEdit={() => openEdit(t)}
                      onDelete={() => setPendingDelete(t)}
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
        title={modal?.mode === "add" ? "Add topic" : "Edit topic"}
        width={460}
      >
        <form onSubmit={handleSave}>
          <FormField label="Name" required>
            <input
              required
              maxLength={100}
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </FormField>
          <FormField label="Description">
            <textarea
              maxLength={500}
              style={{ ...inputStyle, minHeight: 70 }}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </FormField>
          <FormField label="Display order" required>
            <input
              type="number"
              min={1}
              required
              style={inputStyle}
              value={form.displayOrder}
              onChange={(e) =>
                setForm({ ...form, displayOrder: e.target.value })
              }
            />
          </FormField>
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
        title="Delete this topic?"
        message={`"${pendingDelete?.name}" will be removed. Problems referencing it may be affected.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
