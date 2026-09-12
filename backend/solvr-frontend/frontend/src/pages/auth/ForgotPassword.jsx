import { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../../components/auth/AuthShell";
import FormField from "../../components/common/FormField";
import { inputStyle } from "../../components/common/inputStyle";
import Button from "../../components/common/Button";
import { authService } from "../../services/authService";
import { toErrorMessage } from "../../api/apiClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="We'll email you a reset token you can use on the next screen."
      footer={
        <Link to="/login" style={{ color: "var(--pathway)", fontWeight: 700 }}>
          ← Back to login
        </Link>
      }
    >
      {sent ? (
        <div
          style={{
            background: "var(--success-bg)",
            color: "var(--pathway-dark)",
            padding: 14,
            borderRadius: 12,
            fontSize: 14,
          }}
        >
          If an account exists for <strong>{email}</strong>, a reset token has
          been sent. Check your email, then head to{" "}
          <Link to="/reset-password" style={{ fontWeight: 700 }}>
            the reset page
          </Link>
          .
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormField label="Email" required>
            <input
              type="email"
              required
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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
            Send reset token
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
