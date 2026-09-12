import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "../../components/auth/AuthShell";
import FormField from "../../components/common/FormField";
import { inputStyle } from "../../components/common/inputStyle";
import Button from "../../components/common/Button";
import { authService } from "../../services/authService";
import { toErrorMessage } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset password link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        token,
        newPassword,
      });

      toast.success("Password reset! You can log in now.");
      navigate("/login");
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Choose a new password for your account."
      footer={
        <Link to="/login" style={{ color: "var(--pathway)", fontWeight: 700 }}>
          ← Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormField label="New password" required>
          <input
            type="password"
            required
            minLength={6}
            style={inputStyle}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </FormField>

        <FormField label="Confirm password" required>
          <input
            type="password"
            required
            minLength={6}
            style={inputStyle}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter your password again"
          />
        </FormField>

        {error && (
          <div
            style={{
              background: "var(--danger-bg)",
              color: "var(--danger)",
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 13.5,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          loading={loading}
          style={{ width: "100%" }}
        >
          Reset password
        </Button>
      </form>
    </AuthShell>
  );
}
