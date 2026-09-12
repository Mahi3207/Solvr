import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../../components/auth/AuthShell";
import FormField from "../../components/common/FormField";
import { inputStyle } from "../../components/common/inputStyle";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { toErrorMessage } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const profile = await login(form);
      toast.success(`Welcome back, ${profile.name.split(" ")[0]}!`);
      const from = location.state?.from?.pathname;
      if (from) navigate(from, { replace: true });
      else
        navigate(
          profile.role === "ADMIN" ? "/admin/dashboard" : "/app/dashboard",
          { replace: true },
        );
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back 👋"
      subtitle="Log in to keep your streak alive."
      footer={
        <>
          New to Solvr?{" "}
          <Link
            to="/register"
            style={{ color: "var(--pathway)", fontWeight: 700 }}
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormField label="Email" required>
          <input
            type="email"
            required
            style={inputStyle}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </FormField>
        <FormField label="Password" required>
          <input
            type="password"
            required
            style={inputStyle}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </FormField>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 18,
          }}
        >
          <Link
            to="/forgot-password"
            style={{ fontSize: 13, color: "var(--pathway)", fontWeight: 600 }}
          >
            Forgot password?
          </Link>
        </div>

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
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}
