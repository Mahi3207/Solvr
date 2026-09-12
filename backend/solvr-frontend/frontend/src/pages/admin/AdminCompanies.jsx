import { useEffect, useMemo, useState } from "react";
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
import { companyService } from "../../services/companyService";
import { toErrorMessage } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";

export default function AdminCompanies() {
  const toast = useToast();
  const [state, setState] = useState({ loading: true, error: "" });
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', item }
  const [name, setName] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setState({ loading: true, error: "" });
    try {
      const data = await companyService.getAll();
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
    setName("");
    setActive(true);
    setModal({ mode: "add" });
  }
  function openEdit(item) {
    setName(item.name);
    setActive(item.active);
    setModal({ mode: "edit", item });
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === "add") {
        const created = await companyService.create({ name });
        setItems((i) => [...i, created]);
        toast.success("Company added.");
      } else {
        const updated = await companyService.update(modal.item.id, {
          name,
          active,
        });
        setItems((i) => i.map((x) => (x.id === updated.id ? updated : x)));
        toast.success("Company updated.");
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
      await companyService.remove(pendingDelete.id);
      setItems((i) => i.filter((x) => x.id !== pendingDelete.id));
      toast.success("Company deleted.");
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
        <LoadingSpinner label="Loading companies…" />
      </div>
    );
  }

  return (
    <>
      <Topbar
        title="Companies"
        subtitle="Reference data used when tagging problems by company."
      />
      <div style={{ padding: "0 32px 40px" }}>
        <AdminToolbar
          search={search}
          onSearch={setSearch}
          onAdd={openAdd}
          addLabel="Add company"
        />
        {state.error ? (
          <ErrorState message={state.error} onRetry={load} />
        ) : (
          <Card style={{ padding: 0 }}>
            <DataTable
              rows={filtered}
              emptyMessage="No companies yet."
              columns={[
                { key: "id", header: "ID" },
                { key: "name", header: "Name" },
                {
                  key: "active",
                  header: "Status",
                  render: (c) => (
                    <Badge
                      color={c.active ? "var(--easy)" : "var(--ink-soft)"}
                      bg={c.active ? "var(--easy-bg)" : "var(--border-soft)"}
                    >
                      {c.active ? "Active" : "Inactive"}
                    </Badge>
                  ),
                },
                {
                  key: "actions",
                  header: "",
                  render: (c) => (
                    <RowActions
                      onEdit={() => openEdit(c)}
                      onDelete={() => setPendingDelete(c)}
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
        title={modal?.mode === "add" ? "Add company" : "Edit company"}
        width={400}
      >
        <form onSubmit={handleSave}>
          <FormField label="Name" required>
            <input
              required
              style={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
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
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
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
        title="Delete this company?"
        message={`"${pendingDelete?.name}" will be removed. Problems referencing it may need to be updated.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
