import { useState } from "react";
import Modal from "../common/Modal";
import FormField from "../common/FormField";
import { inputStyle } from "../common/inputStyle";
import Button from "../common/Button";
import { PROBLEM_STATUS_OPTIONS } from "../../utils/constants";
import { titleCase } from "../../utils/formatters";
import { activityService } from "../../services/activityService";
import { toErrorMessage } from "../../api/apiClient";
import { useToast } from "../common/Toast";

// Backing DTO (CreateUserProblemActivityRequest / UpdateUserProblemActivityRequest)
// requires: problemId, status, attemptCount, timeSpent, confidenceLevel (1-5),
// difficultyRating (1-5). roadmapId/notes/bookmarked/favourite are optional.
export default function LogActivityModal({ open, onClose, problem, existingActivity, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(() => ({
    status: existingActivity?.status || "IN_PROGRESS",
    attemptCount: existingActivity?.attemptCount ?? 1,
    timeSpent: existingActivity?.timeSpent ?? 15,
    confidenceLevel: existingActivity?.confidenceLevel ?? 3,
    difficultyRating: existingActivity?.difficultyRating ?? 3,
    notes: existingActivity?.notes || "",
    bookmarked: existingActivity?.bookmarked || false,
    favourite: existingActivity?.favourite || false,
    needRevision: existingActivity?.needRevision ?? false,
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      problemId: problem.id,
      status: form.status,
      attemptCount: Number(form.attemptCount),
      timeSpent: Number(form.timeSpent),
      confidenceLevel: Number(form.confidenceLevel),
      difficultyRating: Number(form.difficultyRating),
      notes: form.notes,
      bookmarked: form.bookmarked,
      favourite: form.favourite,
      needRevision: form.needRevision,
    };
    try {
      let saved;
      if (existingActivity) {
        saved = await activityService.update(existingActivity.id, payload);
      } else {
        saved = await activityService.create(payload);
      }
      toast.success(existingActivity ? "Progress updated!" : "Nice — progress logged!");
      onSaved?.(saved);
      onClose();
    } catch (err) {
      setError(toErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Log progress — ${problem?.title || ""}`} width={480}>
      <form onSubmit={handleSubmit}>
        <FormField label="Status" required>
          <select
            style={inputStyle}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {PROBLEM_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {titleCase(s)}
              </option>
            ))}
          </select>
        </FormField>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormField label="Attempt count" required>
            <input
              type="number"
              min={0}
              style={inputStyle}
              value={form.attemptCount}
              onChange={(e) => setForm({ ...form, attemptCount: e.target.value })}
            />
          </FormField>
          <FormField label="Time spent (min)" required>
            <input
              type="number"
              min={0}
              style={inputStyle}
              value={form.timeSpent}
              onChange={(e) => setForm({ ...form, timeSpent: e.target.value })}
            />
          </FormField>
          <FormField label="Confidence (1–5)" required>
            <input
              type="number"
              min={1}
              max={5}
              style={inputStyle}
              value={form.confidenceLevel}
              onChange={(e) => setForm({ ...form, confidenceLevel: e.target.value })}
            />
          </FormField>
          <FormField label="Perceived difficulty (1–5)" required>
            <input
              type="number"
              min={1}
              max={5}
              style={inputStyle}
              value={form.difficultyRating}
              onChange={(e) => setForm({ ...form, difficultyRating: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Notes">
          <textarea
            style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Approach, edge cases, what to remember next time…"
          />
        </FormField>

        <div style={{ display: "flex", gap: 18, marginBottom: 6 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5 }}>
            <input
              type="checkbox"
              checked={form.bookmarked}
              onChange={(e) => setForm({ ...form, bookmarked: e.target.checked })}
            />
            Bookmark
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5 }}>
            <input
              type="checkbox"
              checked={form.favourite}
              onChange={(e) => setForm({ ...form, favourite: e.target.checked })}
            />
            Favourite
          </label>
          <label
  style={{
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13.5,
  }}
>
  <input
    type="checkbox"
    checked={form.needRevision}
    onChange={(e) =>
      setForm({ ...form, needRevision: e.target.checked })
    }
  />
  Need revision
</label>
        </div>

        {error && (
          <div style={{ background: "var(--danger-bg)", color: "var(--danger)", padding: "10px 12px", borderRadius: 10, fontSize: 13, margin: "12px 0" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save progress
          </Button>
        </div>
      </form>
    </Modal>
  );
}
