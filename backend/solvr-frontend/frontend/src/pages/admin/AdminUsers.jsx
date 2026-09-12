import { useEffect, useMemo, useState } from "react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import AdminToolbar from "../../components/admin/AdminToolbar";
import DataTable from "../../components/admin/DataTable";
import RowActions from "../../components/admin/RowActions";
import Pagination from "../../components/common/Pagination";
import { adminService } from "../../services/adminService";
import { toErrorMessage } from "../../api/apiClient";
import { formatDate } from "../../utils/formatters";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/common/Toast";

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  const [state, setState] = useState({ loading: true, error: "" });
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setState({ loading: true, error: "" });
    try {
      const data = await adminService.getAllUsers();
      setUsers(data || []);
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
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  useEffect(() => setPage(1), [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteUser(pendingDelete.id);
      setUsers((u) => u.filter((x) => x.id !== pendingDelete.id));
      toast.success(`${pendingDelete.name} was removed.`);
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
        <LoadingSpinner label="Loading users…" />
      </div>
    );
  }

  return (
    <>
      <Topbar title="Users" subtitle={`${users.length} registered accounts`} />
      <div style={{ padding: "0 32px 40px" }}>
        <AdminToolbar search={search} onSearch={setSearch} />
        {state.error ? (
          <ErrorState message={state.error} onRetry={load} />
        ) : (
          <Card style={{ padding: 0 }}>
            <DataTable
              rows={pageItems}
              emptyMessage="No users match your search."
              columns={[
                { key: "id", header: "ID" },
                { key: "name", header: "Name" },
                { key: "email", header: "Email" },
                {
                  key: "role",
                  header: "Role",
                  render: (u) => (
                    <Badge
                      color={
                        u.role === "ADMIN"
                          ? "var(--violet)"
                          : "var(--pathway-dark)"
                      }
                      bg={
                        u.role === "ADMIN"
                          ? "var(--violet-light)"
                          : "var(--pathway-light)"
                      }
                    >
                      {u.role}
                    </Badge>
                  ),
                },
                {
                  key: "createdAt",
                  header: "Joined",
                  render: (u) => formatDate(u.createdAt),
                },
                {
                  key: "actions",
                  header: "",
                  render: (u) => (
                    <RowActions
                      onDelete={
                        u.id === currentUser?.id
                          ? undefined
                          : () => setPendingDelete(u)
                      }
                    />
                  ),
                },
              ]}
            />
          </Card>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this user?"
        message={`This will permanently remove ${pendingDelete?.name}'s account and all associated data. This cannot be undone.`}
        confirmLabel="Delete user"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
