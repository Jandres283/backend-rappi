import { useState, useEffect } from "react";
import UserTable from "@/components/Admin/Users/UserTable";
import api from "@/api/axios";

export const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchClients = async () => {
      try {
        const res = await api.get('/users', {
          params: { role: 'CLIENT' }
        });

        if (isMounted) {
          const data = res.data;
          const allUsers = Array.isArray(data) ? data : data.users || data.docs || [];
          
          // Filtrado insensible a mayúsculas/minúsculas para prevenir discrepancias
          setClients(allUsers.filter(u => u.role?.toLowerCase() === "client"));
        }
      } catch (err) {
        console.error("Error al cargar clientes:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchClients();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="admin-page" style={{ padding: "1.5rem" }}>
      <h1>Gestión de Clientes</h1>
      <p>Listado de clientes registrados en la plataforma.</p>

      <UserTable users={clients} isLoading={isLoading} />
    </div>
  );
};

export default ClientsPage;