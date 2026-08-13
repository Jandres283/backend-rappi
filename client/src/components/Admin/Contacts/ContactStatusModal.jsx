import { useState } from "react";

const ContactStatusModal = ({ contact, isOpen, onClose, onUpdateStatus }) => {
  // Inicializamos el estado usando una función que derive directamente de las props
  const [status, setStatus] = useState(() => contact?.status || "PENDING");

  if (!isOpen || !contact) return null;

  const handleStatusChange = (e) => {
    e.preventDefault();
    if (onUpdateStatus) {
      onUpdateStatus(contact._id || contact.id, status);
    }
  };

  return (
    <div 
      className="modal-overlay fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" 
      onClick={onClose}
    >
      <div 
        className="modal-container bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-bold text-gray-800">Mensaje de Contacto</h3>
          <button 
            type="button"
            className="modal-close-btn text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="modal-body space-y-4">
          <div className="detail-group text-sm">
            <label className="font-semibold text-gray-700 block">Remitente:</label>
            <span className="text-gray-600">{contact.name || contact.fullname || "Sin nombre"} ({contact.email})</span>
          </div>

          <div className="detail-group text-sm">
            <label className="font-semibold text-gray-700 block">Asunto:</label>
            <span className="text-gray-600">{contact.subject || "Sin asunto"}</span>
          </div>

          <div className="detail-group text-sm">
            <label className="font-semibold text-gray-700 block">Mensaje:</label>
            <p className="contact-message-box bg-slate-50 p-3 rounded-lg border text-gray-600 mt-1 whitespace-pre-wrap">
              {contact.message || "Sin mensaje."}
            </p>
          </div>

          <form onSubmit={handleStatusChange} className="status-update-form space-y-3 pt-2">
            <label htmlFor="contact-status" className="block text-sm font-semibold text-gray-700">
              Estado del Ticket:
            </label>
            <select
              id="contact-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-white"
            >
              <option value="PENDING">Pendiente (PENDING)</option>
              <option value="IN_PROGRESS">En Proceso (IN_PROGRESS)</option>
              <option value="RESOLVED">Resuelto (RESOLVED)</option>
            </select>

            <div className="modal-footer flex justify-end gap-2 pt-4 border-t">
              <button 
                type="button" 
                className="btn-secondary px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium cursor-pointer" 
                onClick={onClose}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-primary px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium transition cursor-pointer"
              >
                Actualizar Estado
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactStatusModal;