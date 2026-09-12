import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import FormField from "../../components/common/FormField";
import { inputStyle } from "../../components/common/inputStyle";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { PLATFORM_OPTIONS } from "../../utils/constants";
import { titleCase } from "../../utils/formatters";
import { problemService } from "../../services/problemService";
import { topicService } from "../../services/topicService";
import { companyService } from "../../services/companyService";
import { tagService } from "../../services/tagService";
import { toErrorMessage, getFieldErrors } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";

const emptyForm = {
  title: "",
  description: "",
  difficulty: "EASY",
  platform: "LEETCODE",
  problemUrl: "",
  estimatedTime: 20,
  topicId: "",
  companyIds: [],
  tagIds: [],
  premium: false,
  active: true,
};

export default function AdminProblemForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [topicList, companyList, tagList, existing] = await Promise.all([
          topicService.getAll(),
          companyService.getAll(),
          tagService.getAll(),
          isEdit ? problemService.getById(id) : Promise.resolve(null),
        ]);
        if (!mounted) return;
        setTopics(topicList || []);
        setCompanies((companyList || []).filter((c) => c.active !== false));
        setTags((tagList || []).filter((t) => t.active !== false));

        if (existing) {
          setForm({
            title: existing.title,
            description: existing.description || "",
            difficulty: existing.difficulty,
            platform: existing.platform,
            problemUrl: existing.problemUrl,
            estimatedTime: existing.estimatedTime,
            topicId: existing.topicId,
            companyIds: (companyList || [])
              .filter((c) => existing.companies?.includes(c.name))
              .map((c) => c.id),
            tagIds: (tagList || [])
              .filter((t) => existing.tags?.includes(t.name))
              .map((t) => t.id),
            premium: existing.premium,
            active: existing.active,
          });
        }
      } catch (err) {
        toast.error(toErrorMessage(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function toggleMulti(field, value) {
    setForm((f) => {
      const set = new Set(f[field]);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...f, [field]: Array.from(set) };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (form.companyIds.length === 0 || form.tagIds.length === 0) {
      setError("Select at least one company and one tag.");
      return;
    }

    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
      difficulty: form.difficulty,
      platform: form.platform,
      problemUrl: form.problemUrl,
      estimatedTime: Number(form.estimatedTime),
      topicId: Number(form.topicId),
      companyIds: form.companyIds.map(Number),
      tagIds: form.tagIds.map(Number),
      premium: form.premium,
      ...(isEdit ? { active: form.active } : {}),
    };

    try {
      if (isEdit) {
        await problemService.update(id, payload);
        toast.success("Problem updated.");
        navigate(`/admin/problems/${id}`);
      } else {
        const created = await problemService.create(payload);
        toast.success("Problem created.");
        navigate(`/admin/problems/${created.id}`);
      }
    } catch (err) {
      setError(toErrorMessage(err));
      setFieldErrors(getFieldErrors(err) || {});
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <LoadingSpinner label="Loading form…" />
      </div>
    );
  }

  return (
    <>
      <Topbar
        title={isEdit ? "Edit problem" : "Add problem"}
        subtitle={
          <Link
            to={isEdit ? `/admin/problems/${id}` : "/admin/problems"}
            style={{ color: "var(--pathway)", fontWeight: 600 }}
          >
            ← Cancel
          </Link>
        }
      />
      <div style={{ padding: "0 32px 60px", maxWidth: 760 }}>
        <Card>
          <form onSubmit={handleSubmit}>
            <FormField label="Title" required error={fieldErrors.title}>
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
                style={{ ...inputStyle, minHeight: 110 }}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </FormField>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <FormField label="Difficulty" required>
                <select
                  style={inputStyle}
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({ ...form, difficulty: e.target.value })
                  }
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </FormField>
              <FormField label="Platform" required>
                <select
                  style={inputStyle}
                  value={form.platform}
                  onChange={(e) =>
                    setForm({ ...form, platform: e.target.value })
                  }
                >
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {titleCase(p)}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField
              label="Problem URL"
              required
              error={fieldErrors.problemUrl}
            >
              <input
                required
                type="url"
                style={inputStyle}
                value={form.problemUrl}
                onChange={(e) =>
                  setForm({ ...form, problemUrl: e.target.value })
                }
                placeholder="https://leetcode.com/problems/…"
              />
            </FormField>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <FormField label="Estimated time (min)" required>
                <input
                  type="number"
                  min={1}
                  required
                  style={inputStyle}
                  value={form.estimatedTime}
                  onChange={(e) =>
                    setForm({ ...form, estimatedTime: e.target.value })
                  }
                />
              </FormField>
              <FormField label="Topic" required error={fieldErrors.topicId}>
                <select
                  required
                  style={inputStyle}
                  value={form.topicId}
                  onChange={(e) =>
                    setForm({ ...form, topicId: e.target.value })
                  }
                >
                  <option value="">Select topic…</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField
              label="Companies"
              required
              error={fieldErrors.companyIds}
            >
              {companies.length === 0 ? (
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                  No companies yet —{" "}
                  <Link
                    to="/admin/companies"
                    style={{ color: "var(--pathway)" }}
                  >
                    add one first
                  </Link>
                  .
                </p>
              ) : (
                <MultiSelectChips
                  options={companies}
                  selected={form.companyIds}
                  onToggle={(v) => toggleMulti("companyIds", v)}
                />
              )}
            </FormField>

            <FormField label="Tags" required error={fieldErrors.tagIds}>
              {tags.length === 0 ? (
                <p style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                  No tags yet —{" "}
                  <Link to="/admin/tags" style={{ color: "var(--pathway)" }}>
                    add one first
                  </Link>
                  .
                </p>
              ) : (
                <MultiSelectChips
                  options={tags}
                  selected={form.tagIds}
                  onToggle={(v) => toggleMulti("tagIds", v)}
                />
              )}
            </FormField>

            <div style={{ display: "flex", gap: 20, marginBottom: 6 }}>
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
                  checked={form.premium}
                  onChange={(e) =>
                    setForm({ ...form, premium: e.target.checked })
                  }
                />{" "}
                Premium problem
              </label>
              {isEdit && (
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
              )}
            </div>

            {error && (
              <div
                style={{
                  background: "var(--danger-bg)",
                  color: "var(--danger)",
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: 13,
                  margin: "14px 0",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
              }}
            >
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  navigate(isEdit ? `/admin/problems/${id}` : "/admin/problems")
                }
              >
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {isEdit ? "Save changes" : "Create problem"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}

function MultiSelectChips({ options, selected, onToggle }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {options.map((o) => {
        const active = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onToggle(o.id)}
            style={{
              padding: "6px 13px",
              borderRadius: 999,
              fontSize: 12.5,
              fontWeight: 600,
              border: `1px solid ${active ? "var(--pathway)" : "var(--border)"}`,
              background: active
                ? "var(--pathway-light)"
                : "var(--paper-raised)",
              color: active ? "var(--pathway-dark)" : "var(--ink-soft)",
            }}
          >
            {o.name}
          </button>
        );
      })}
    </div>
  );
}
