import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children, width = 480, footer }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(21, 24, 43, 0.45)",
        backdropFilter: "blur(2px)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-up"
        style={{
          width: "100%",
          maxWidth: width,
          maxHeight: "88vh",
          overflowY: "auto",
          background: "var(--paper-raised)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          padding: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontSize: 19 }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "var(--border-soft)",
              border: "none",
              width: 30,
              height: 30,
              borderRadius: "50%",
              fontSize: 15,
              color: "var(--ink-soft)",
            }}
          >
            ✕
          </button>
        </div>
        {children}
        {footer && <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
