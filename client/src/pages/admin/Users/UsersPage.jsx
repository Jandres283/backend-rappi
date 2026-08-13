import { useState, useEffect } from "react";
import UserTable from "@/components/Admin/Users/UserTable";
import UserRoleModal from "@/components/Admin/Users/UserRoleModal";
import api from "@/api/axios";

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await api.get("/users");
        if (isMounted) {
          // Soporta respuesta directa de Array o paginada mediante data.docs / data.users
          setUsers(Array.isArray(data) ? data : data.docs || data.users || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.msg || err.response?.data?.message || err.message || "Error al obtener usuarios"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [reload]);

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      // Llamada a la ruta PATCH /users/:id correspondiente al Backend
      await api.patch(`/users/${userId}`, { role: newRole });

      alert("Rol actualizado con éxito");
      setIsModalOpen(false);
      setSelectedUser(null);
      setReload((prev) => !prev);
    } catch (err) {
      alert(
        `Error: ${
          err.response?.data?.msg || err.response?.data?.message || err.message || "No se pudo actualizar el rol"
        }`
      );
    }
  };

  return (
    <div className="admin-page" style={{ padding: "1.5rem" }}>
      <h1>Administración de Usuarios y Roles</h1>
      <p>
        Gestión de permisos para administradores, repartidores, clientes y
        restaurantes.
      </p>

      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}

      <UserTable
        users={users}
        isLoading={isLoading}
        onChangeRole={handleOpenRoleModal}
      />

      {/* Agregado la propiedad key única para forzar el reinicio limpio del estado del modal */}
      <UserRoleModal
        key={selectedUser?._id || selectedUser?.id || "modal-user"}
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onUpdateRole={handleUpdateRole}
      />
    </div>
  );
};

export default UsersPage;