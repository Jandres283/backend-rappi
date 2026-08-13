const UserTable = ({ users = [], onChangeRole, isLoading }) => {
  if (isLoading) {
    return <div className="admin-loading">Cargando usuarios...</div>;
  }

  if (!users || users.length === 0) {
    return <div className="admin-empty">No hay usuarios registrados.</div>;
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const id = user._id || user.id;

            // Mapeo flexible de nombres de Mongoose
            const fullName = user.firstName 
              ? `${user.firstName} ${user.lastName || ""}`.trim() 
              : user.name || user.fullname || "Sin nombre";

            return (
              <tr key={id}>
                <td>{fullName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                    {user.role?.toUpperCase()}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-action btn-edit"
                    onClick={() => onChangeRole && onChangeRole(user)}
                  >
                    Cambiar Rol
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;