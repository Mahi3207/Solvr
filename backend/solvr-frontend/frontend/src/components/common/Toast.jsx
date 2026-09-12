import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => remove(id), 3500);
    },
    [remove]
  );

  const toast = {
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {createPortal(
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 2000,
          }}
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              style={{
                animation: "toastIn 0.25s ease both",
                background: t.type === "error" ? "var(--danger)" : t.type === "info" ? "var(--ink)" : "var(--pathway-dark)",
                color: "white",
                padding: "12px 18px",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--shadow-lg)",
                fontSize: 14,
                fontWeight: 500,
                maxWidth: 340,
              }}
            >
              {t.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
