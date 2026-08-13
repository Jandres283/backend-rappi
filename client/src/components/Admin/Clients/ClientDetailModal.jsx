// src/components/Admin/Clients/ClientDetailModal.jsx


const ClientDetailModal = ({ client, isOpen, onClose }) => {
  if (!isOpen || !client) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detalles del Cliente</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-group">
            <label>ID:</label>
            <span>{client._id || client.id}</span>
          </div>
          <div className="detail-group">
            <label>Nombre:</label>
            <span>
              {client.firstname} {client.lastname}
            </span>
          </div>
          <div className="detail-group">
            <label>Email:</label>
            <span>{client.email}</span>
          </div>
          <div className="detail-group">
            <label>Teléfono:</label>
            <span>{client.phone || "No especificado"}</span>
          </div>
          <div className="detail-group">
            <label>Dirección:</label>
            <span>{client.address || "No registrada"}</span>
          </div>
          <div className="detail-group">
            <label>Estado de la Cuenta:</label>
            <span>{client.active ? "Activo" : "Inactivo"}</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailModal;