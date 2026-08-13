import { useState } from "react";

const UserRoleModal = ({ isOpen, onClose, onUpdateRole, user }) => {
  // Guardamos el ID del usuario anterior para detectar cuándo cambia
  const [prevUserId, setPrevUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("client");

  const currentUserId = user?._id || user?.id;

  // Patrón oficial de React: Sincronización directa sin useEffect ni alertas de ESLint
  if (currentUserId !== prevUserId) {
    setPrevUserId(currentUserId);
    setSelectedRole(user?.role ? String(user.role).toLowerCase() : "client");
  }

  if (!isOpen || !user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateRole) {
      onUpdateRole(currentUserId, selectedRole);
    }
  };

  const displayName = user.firstName 
    ? `${user.firstName} ${user.lastName || ""}`.trim() 
    : user.name || user.email || "Usuario";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Cambiar Rol de Usuario</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="detail-group">
            <label>Usuario:</label>
            <span>{displayName}</span>
          </div>

          <div className="form-group">
            <label htmlFor="user-role-select">Selecciona el nuevo Rol:</label>
            <select
              id="user-role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="admin">ADMIN</option>
              <option value="client">CLIENT</option>
              <option value="driver">DRIVER / DELIVERY</option>
              <option value="restaurant">RESTAURANT</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar Rol
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRoleModal;