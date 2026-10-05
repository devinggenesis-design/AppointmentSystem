import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./ConfirmModal.css";

function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon = null,
  danger = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {icon && (
          <div className={`modal-icon ${danger ? "danger" : ""}`}>{icon}</div>
        )}

        <h3 id="modal-title" className="modal-title">
          {title}
        </h3>
        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          <button className="modal-btn modal-btn--ghost" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`modal-btn ${
              danger ? "modal-btn--danger" : "modal-btn--primary"
            }`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default ConfirmModal;
