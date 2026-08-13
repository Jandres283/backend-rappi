const ContactTable = ({ contacts = [], onSelectContact, isLoading }) => {
  if (isLoading) {
    return <div className="admin-loading p-8 text-center text-gray-500">Cargando mensajes de contacto...</div>;
  }

  if (!contacts || contacts.length === 0) {
    return <div className="admin-empty p-8 text-center text-gray-500">No hay mensajes de contacto registrados.</div>;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "RESOLVED":
      case "read":
        return "bg-emerald-100 text-emerald-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <div className="admin-table-container bg-white shadow-sm border rounded-xl overflow-hidden">
      <table className="admin-table w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-xs font-bold uppercase text-gray-500">Nombre</th>
            <th className="p-4 text-xs font-bold uppercase text-gray-500">Email</th>
            <th className="p-4 text-xs font-bold uppercase text-gray-500">Asunto</th>
            <th className="p-4 text-xs font-bold uppercase text-gray-500">Fecha</th>
            <th className="p-4 text-xs font-bold uppercase text-gray-500">Estado</th>
            <th className="p-4 text-xs font-bold uppercase text-gray-500 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {contacts.map((contact) => {
            const id = contact._id || contact.id;
            const currentStatus = contact.status || "PENDING";

            return (
              <tr key={id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">{contact.name || contact.fullname || "Sin Nombre"}</td>
                <td className="p-4 text-gray-600 text-sm">{contact.email}</td>
                <td className="p-4 text-gray-700 text-sm max-w-xs truncate">{contact.subject || "Sin asunto"}</td>
                <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                  {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="p-4">
                  <span className={`status-pill px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(currentStatus)}`}>
                    {currentStatus}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    className="btn-action btn-view px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-lg text-xs transition cursor-pointer"
                    onClick={() => onSelectContact(contact)}
                  >
                    Gestionar
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

export default ContactTable;