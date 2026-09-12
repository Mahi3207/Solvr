import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Topbar from "../../components/layout/Topbar";
import Card from "../../components/common/Card";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";
import FormField from "../../components/common/FormField";
import { inputStyle } from "../../components/common/inputStyle";
import Button from "../../components/common/Button";
import RoadmapLevelBadge from "../../components/ui/RoadmapLevelBadge";
import RowActions from "../../components/admin/RowActions";
import { roadmapService } from "../../services/roadmapService";
import { roadmapProblemService } from "../../services/roadmapProblemService";
import { problemService } from "../../services/problemService";
import { toErrorMessage } from "../../api/apiClient";
import { useToast } from "../../components/common/Toast";

export default function AdminRoadmapDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [state, setState] = useState({ loading: true, error: "" });
  const [roadmap, setRoadmap] = useState(null);
  const [stages, setStages] = useState([]);
  const [allProblems, setAllProblems] = useState([]);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ problemId: "", displayOrder: 1 });
  const [saving, setSaving] = useState(false);

  const [problemSearch, setProblemSearch] = useState("");
  const [showProblemResults, setShowProblemResults] = useState(false);
  const problemSearchRef = useRef(null);

  const [editStage, setEditStage] = useState(null);
  const [editOrder, setEditOrder] = useState(1);

  const [pendingRemove, setPendingRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  async function load() {
    setState({ loading: true, error: "" });
    try {
      const [r, links, problems] = await Promise.all([
        roadmapService.getById(id),
        roadmapProblemService.getByRoadmap(id),
        problemService.getAll(),
      ]);
      setRoadmap(r);
      setStages(
        [...(links || [])].sort((a, b) => a.displayOrder - b.displayOrder),
      );
      setAllProblems(problems || []);
      setState({ loading: false, error: "" });
    } catch (err) {
      setState({ loading: false, error: toErrorMessage(err) });
    }
  }
  useEffect(() => {
    load();
  }, [id]);

  function openAdd() {
    setAddForm({ problemId: "", displayOrder: stages.length + 1 });
    setProblemSearch("");
    setShowProblemResults(false);
    setAddOpen(true);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!addForm.problemId) return;
    setSaving(true);
    try {
      const created = await roadmapProblemService.add(id, {
        problemId: Number(addForm.problemId),
        displayOrder: Number(addForm.displayOrder),
      });
      setStages((s) =>
        [...s, created].sort((a, b) => a.displayOrder - b.displayOrder),
      );
      toast.success("Problem added to roadmap.");
      setAddOpen(false);
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function openEditOrder(stage) {
    setEditOrder(stage.displayOrder);
    setEditStage(stage);
  }

  async function handleUpdateOrder(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await roadmapProblemService.update(editStage.id, {
        displayOrder: Number(editOrder),
      });
      setStages((s) =>
        s
          .map((x) => (x.id === updated.id ? updated : x))
          .sort((a, b) => a.displayOrder - b.displayOrder),
      );
      toast.success("Stage order updated.");
      setEditStage(null);
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    setRemoving(true);
    try {
      await roadmapProblemService.remove(pendingRemove.id);
      setStages((s) => s.filter((x) => x.id !== pendingRemove.id));
      toast.success("Removed from roadmap.");
      setPendingRemove(null);
    } catch (err) {
      toast.error(toErrorMessage(err));
    } finally {
      setRemoving(false);
    }
  }

  if (state.loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <LoadingSpinner label="Loading roadmap…" />
      </div>
    );
  }
  if (state.error || !roadmap) {
    return (
      <>
        <Topbar title="Roadmap" />
        <ErrorState message={state.error || "Roadmap not found."} />
      </>
    );
  }

  const availableProblems = allProblems.filter(
    (p) => !stages.some((s) => s.problemId === p.id),
  );
  const filteredProblems = availableProblems.filter((p) =>
    p.title.toLowerCase().includes(problemSearch.toLowerCase()),
  );

  return (
    <>
      <Topbar
        title={roadmap.title}
        subtitle={
          <Link
            to="/admin/roadmaps"
            style={{ color: "var(--pathway)", fontWeight: 600 }}
          >
            ← Back to roadmaps
          </Link>
        }
      />
      <div
        style={{
          padding: "0 32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <Card
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <RoadmapLevelBadge level={roadmap.level} />
          <span style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
            {roadmap.description}
          </span>
          <span
            className="mono"
            style={{
              marginLeft: "auto",
              fontSize: 12.5,
              color: "var(--ink-soft)",
            }}
          >
            ~{roadmap.estimatedDuration} days
          </span>
        </Card>

        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <h3 style={{ fontSize: 16 }}>Stages ({stages.length})</h3>
            <Button size="sm" onClick={openAdd}>
              + Add problem
            </Button>
          </div>
          {stages.length === 0 ? (
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
              No problems added to this roadmap yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {stages.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 4px",
                    borderBottom: "1px solid var(--border-soft)",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span
                      className="mono"
                      style={{
                        width: 28,
                        textAlign: "center",
                        fontSize: 12.5,
                        color: "var(--ink-soft)",
                      }}
                    >
                      #{s.displayOrder}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>
                      {s.problemTitle}
                    </span>
                  </div>
                  <RowActions
                    onEdit={() => openEditOrder(s)}
                    onDelete={() => setPendingRemove(s)}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add problem to roadmap"
        width={440}
      >
        <form onSubmit={handleAdd}>
          <FormField label="Problem" required>
            <div>
              <input
                type="text"
                required
                style={inputStyle}
                placeholder="🔍 Search problem by title..."
                value={problemSearch}
                onChange={(e) => {
                  setProblemSearch(e.target.value);
                  setAddForm({ ...addForm, problemId: "" });
                  setShowProblemResults(true);
                }}
                onFocus={() => setShowProblemResults(true)}
                autoComplete="off"
              />

              {showProblemResults && problemSearch && (
                <div
                  style={{
                    marginTop: 6,
                    maxHeight: 180,
                    overflowY: "auto",
                    background: "var(--paper-raised)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: 8,
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {filteredProblems.length === 0 ? (
                    <div
                      style={{
                        padding: "12px",
                        fontSize: 13,
                        color: "var(--ink-soft)",
                      }}
                    >
                      No problems found.
                    </div>
                  ) : (
                    filteredProblems.slice(0, 50).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setAddForm({
                            ...addForm,
                            problemId: String(p.id),
                          });
                          setProblemSearch(p.title);
                          setShowProblemResults(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px 12px",
                          border: "none",
                          borderBottom: "1px solid var(--border-soft)",
                          background: "transparent",
                          color: "var(--ink)",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: 13.5,
                        }}
                      >
                        {p.title}
                      </button>
                    ))
                  )}
                </div>
              )}

              {!addForm.problemId && problemSearch && !showProblemResults && (
                <div
                  style={{
                    marginTop: 5,
                    fontSize: 12,
                    color: "var(--ink-soft)",
                  }}
                >
                  Please select a problem from the results.
                </div>
              )}
            </div>
          </FormField>
          <FormField label="Display order" required>
            <input
              type="number"
              min={1}
              required
              style={inputStyle}
              value={addForm.displayOrder}
              onChange={(e) =>
                setAddForm({ ...addForm, displayOrder: e.target.value })
              }
            />
          </FormField>
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
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Add
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editStage}
        onClose={() => setEditStage(null)}
        title={`Reorder — ${editStage?.problemTitle || ""}`}
        width={360}
      >
        <form onSubmit={handleUpdateOrder}>
          <FormField label="Display order" required>
            <input
              type="number"
              min={1}
              required
              style={inputStyle}
              value={editOrder}
              onChange={(e) => setEditOrder(e.target.value)}
            />
          </FormField>
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
              onClick={() => setEditStage(null)}
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
        open={!!pendingRemove}
        title="Remove from roadmap?"
        message={`"${pendingRemove?.problemTitle}" will be removed from this roadmap's stages.`}
        confirmLabel="Remove"
        loading={removing}
        onConfirm={handleRemove}
        onCancel={() => setPendingRemove(null)}
      />
    </>
  );
}
