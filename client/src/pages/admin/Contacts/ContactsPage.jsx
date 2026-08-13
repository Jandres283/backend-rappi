import { useState, useEffect } from "react";
import api from "@/api/axios";
import ContactTable from "@/components/Admin/Contacts/ContactTable";
import ContactStatusModal from "@/components/Admin/Contacts/ContactStatusModal";
import "./ContactsPage.scss";

export const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para forzar recargas limpias
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Estado para el modal
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carga de contactos
  useEffect(() => {
    let isMounted = true;

    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get("/contacts");
        const data = response.data;

        if (isMounted) {
          setContacts(Array.isArray(data) ? data : data?.contacts || data?.docs || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error al obtener los contactos:", err);
          setError(
            err.response?.data?.message || err.response?.data?.msg || "No se pudieron cargar los mensajes de contacto."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContacts();

    return () => {
      isMounted = false;
    };
  }, [reloadTrigger]);

  const handleRefresh = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  // Actualizar el estado del contacto en el servidor y en el estado local
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/contacts/${id}`, { status: newStatus });

      setContacts((prevContacts) =>
        prevContacts.map((item) => {
          const itemId = item._id || item.id;
          return itemId === id ? { ...item, status: newStatus } : item;
        })
      );

      handleCloseModal();
    } catch (err) {
      console.error("Error al actualizar el estado:", err);
      alert(
        "Ocurrió un error al intentar actualizar el estado del ticket: " +
        (err.response?.data?.message || err.response?.data?.msg || err.message)
      );
    }
  };

  return (
    <div className="contacts-admin-page p-6 max-w-7xl mx-auto">
      <div className="page-header mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mensajes de Contacto</h1>
          <p className="text-sm text-gray-500">
            Gestiona las consultas y reclamaciones de los usuarios
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition cursor-pointer"
        >
          Refrescar Lista
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Tabla principal */}
      <ContactTable
        contacts={contacts}
        onSelectContact={handleSelectContact}
        isLoading={isLoading}
      />

      {/* Modal para actualizar estado */}
      <ContactStatusModal
        key={selectedContact?._id || selectedContact?.id || "modal"}
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default ContactsPage;