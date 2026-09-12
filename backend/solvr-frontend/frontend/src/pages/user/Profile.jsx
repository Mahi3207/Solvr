import { useState } from "react";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import FormField from "../../components/common/FormField";
import { inputStyle } from "../../components/common/inputStyle";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Badge from "../../components/common/Badge";
import { initials, formatDate } from "../../utils/formatters";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/userService";
import { toErrorMessage } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, refreshProfile, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveName(e) {
    e.preventDefault();
    setSavingName(true);
    try {
      await userService.updateProfile({ name });
      await refreshProfile();
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setSavingName(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPwError("");
    setSavingPw(true);
    try {
      await userService.changePassword(pwForm);
      toast.success("Password changed.");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPwError(toErrorMessage(err));
    } finally {
      setSavingPw(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await userService.deleteMyAccount();
      toast.success("Account deleted. We're sorry to see you go.");
      await logout().catch(() => {});
      navigate("/login");
    } catch (err) {
      toast.error(toErrorMessage(err));
      setDeleting(false);
    }
  }

  return (
    <>
      <Topbar title="Profile" subtitle="Manage your account details." />
      <div
        style={{
          padding: "0 32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 640,
        }}
      >
        <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--pathway)",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {initials(user?.name)}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
            <div style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
              {user?.email}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <Badge color="var(--pathway-dark)" bg="var(--pathway-light)">
                {user?.role}
              </Badge>
              <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                Joined {formatDate(user?.createdAt)}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15.5, marginBottom: 14 }}>Edit name</h3>
          <form onSubmit={handleSaveName}>
            <FormField label="Full name" required>
              <input
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>
            <Button type="submit" loading={savingName}>
              Save changes
            </Button>
          </form>
        </Card>

        <Card>
          <h3 style={{ fontSize: 15.5, marginBottom: 14 }}>Change password</h3>
          <form onSubmit={handleChangePassword}>
            <FormField label="Current password" required>
              <input
                type="password"
                required
                style={inputStyle}
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, currentPassword: e.target.value })
                }
              />
            </FormField>
            <FormField label="New password" required>
              <input
                type="password"
                required
                minLength={6}
                style={inputStyle}
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, newPassword: e.target.value })
                }
              />
            </FormField>
            {pwError && (
              <div
                style={{
                  background: "var(--danger-bg)",
                  color: "var(--danger)",
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                {pwError}
              </div>
            )}
            <Button type="submit" loading={savingPw}>
              Update password
            </Button>
          </form>
        </Card>

        <Card style={{ border: "1px solid var(--hard-bg)" }}>
          <h3
            style={{ fontSize: 15.5, marginBottom: 6, color: "var(--danger)" }}
          >
            Danger zone
          </h3>
          <p
            style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 14 }}
          >
            Deleting your account permanently removes your profile and progress.
            This cannot be undone.
          </p>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Delete my account
          </Button>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete your account?"
        message="This will permanently delete your Solvr account and all associated progress. This action cannot be undone."
        confirmLabel="Delete account"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
