import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../../components/auth/AuthShell";
import FormField from "../../components/common/FormField";
import { inputStyle } from "../../components/common/inputStyle";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { toErrorMessage, getFieldErrors } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    try {
      await register(form);
      await login({ email: form.email, password: form.password });
      toast.success("Account created. Let's start solving!");
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      setError(toErrorMessage(err));
      setFieldErrors(getFieldErrors(err) || {});
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Start your path 🚀"
      subtitle="Create a free Solvr account to track progress, streaks, and mastery."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--pathway)", fontWeight: 700 }}
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormField label="Name" required error={fieldErrors.name}>
          <input
            required
            style={inputStyle}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Mahi Sharma"
          />
        </FormField>
        <FormField label="Email" required error={fieldErrors.email}>
          <input
            type="email"
            required
            style={inputStyle}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </FormField>
        <FormField label="Password" required error={fieldErrors.password}>
          <input
            type="password"
            required
            minLength={6}
            style={inputStyle}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 6 characters"
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
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
