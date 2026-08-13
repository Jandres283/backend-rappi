// src/components/Shared/BasicModal/BasicModal.jsx
import "./BasicModal.scss";

const BasicModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="basic-modal-overlay" onClick={onClose}>
      <div
        className="basic-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="basic-modal-header">
            <h3>{title}</h3>
            <button className="modal-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
        )}
        <div className="basic-modal-content">{children}</div>
      </div>
    </div>
  );
};

export default BasicModal;