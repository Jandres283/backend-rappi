// src/components/Admin/Clients/ClientTable.jsx


const ClientTable = ({ clients = [], onSelectClient, isLoading }) => {
  if (isLoading) {
    return <div className="admin-loading">Cargando clientes...</div>;
  }

  if (!clients || clients.length === 0) {
    return <div className="admin-empty">No hay clientes registrados.</div>;
  }

  return (
    <div className="admin-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre / Razón Social</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id || client.id}>
              <td>
                {client.firstname || client.name} {client.lastname || ""}
              </td>
              <td>{client.email}</td>
              <td>{client.phone || "N/A"}</td>
              <td>
                <span
                  className={`status-pill ${
                    client.active ? "status-active" : "status-inactive"
                  }`}
                >
                  {client.active ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <button
                  className="btn-action btn-view"
                  onClick={() => onSelectClient(client)}
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;