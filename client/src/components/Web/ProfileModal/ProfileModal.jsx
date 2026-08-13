import { useState, useEffect } from "react";
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiGlobe } from "react-icons/fi";
import "./ProfileModal.scss";

// ✅ Corregido para usar la variable de entorno unificada con fallback a localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const ProfileModal = ({ isOpen, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    district: ""
  });

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadUserProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = user?._id || user?.id || user?.uid;

      // 1. Cargar datos iniciales desde props o localStorage
      let initialUser = user;
      if (!initialUser) {
        try {
          const stored = localStorage.getItem("user");
          if (stored) {
            const parsed = JSON.parse(stored);
            initialUser = parsed.user || parsed;
          }
        } catch {
          // Silenciar
        }
      }

      if (initialUser && isMounted) {
        setFormData({
          firstName: initialUser.firstName || initialUser.firstname || "",
          lastName: initialUser.lastName || initialUser.lastname || "",
          phone: initialUser.phone || "",
          address: typeof initialUser.address === "string" 
            ? initialUser.address 
            : initialUser.address?.address || "",
          district: initialUser.district || initialUser.address?.district || ""
        });
      }

      if (!token) return;

      // 2. Sincronizar desde la API si hay token
      try {
        let resUser = null;
        if (userId) {
          resUser = await fetch(`${API_URL}/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!resUser.ok) {
            resUser = await fetch(`${API_URL}/users/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
          }
        }

        if (!resUser || !resUser.ok) {
          resUser = await fetch(`${API_URL}/user/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        if (resUser && resUser.ok) {
          const data = await resUser.json();
          const dbUser = data.user || data;

          let extractedAddress = "";
          let extractedDistrict = "";

          if (typeof dbUser.address === "string") {
            extractedAddress = dbUser.address;
          } else if (typeof dbUser.address === "object" && dbUser.address !== null) {
            extractedAddress = dbUser.address.address || dbUser.address.street || "";
            extractedDistrict = dbUser.address.district || dbUser.address.city || "";
          }

          if (Array.isArray(dbUser.addresses) && dbUser.addresses.length > 0) {
            const main = dbUser.addresses.find((a) => a.title === "Principal") || dbUser.addresses[0];
            extractedAddress = main.address || extractedAddress;
            extractedDistrict = main.district || main.city || extractedDistrict;
          }

          if (isMounted) {
            setFormData({
              firstName: dbUser.firstName || dbUser.firstname || initialUser?.firstName || "",
              lastName: dbUser.lastName || dbUser.lastname || initialUser?.lastName || "",
              phone: dbUser.phone || initialUser?.phone || "",
              address: extractedAddress || initialUser?.address || "",
              district: extractedDistrict || dbUser.district || initialUser?.district || ""
            });
          }
        }
      } catch {
        // Silenciar errores de carga
      }
    };

    loadUserProfile();

    return () => {
      isMounted = false;
      setIsEditing(false);
    };
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const userId = user?._id || user?.id || user?.uid;

    const jsonPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address,
      district: formData.district
    };

    let updatedUserData = {
      ...(user || {}),
      ...formData,
      // Mantenemos soporte por si el backend usa objeto anidado address
      address: formData.address,
      district: formData.district
    };

    if (token && userId) {
      try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(jsonPayload)
        });

        if (response.ok) {
          const data = await response.json();
          const apiUser = data.user || data;
          updatedUserData = { ...updatedUserData, ...apiUser };
        }
      } catch {
        // Silenciar errores de red, se mantiene la actualización local
      }
    }

    // 1. Guardar objeto de usuario actualizado
    localStorage.setItem("user", JSON.stringify(updatedUserData));

    // 2. Disparar eventos globales para sincronizar el HomePage
    window.dispatchEvent(new Event("auth-change"));
    window.dispatchEvent(new Event("storage"));

    setLoading(false);
    setIsEditing(false);
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="profileCard" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="btnClose" onClick={onClose}>
          <FiX />
        </button>

        <div className="profileHeader">
          <div className="avatarBadge">
            <FiUser />
          </div>
          <h3>Mis Datos de Registro</h3>
          <p>{isEditing ? "Modifica tus datos personales" : "Información asociada a tu cuenta"}</p>
        </div>

        <form onSubmit={handleSave} className="profileForm">
          {/* Nombre */}
          <div className="dataItem">
            <FiUser className="itemIcon" />
            <div className="inputGroup">
              <label>Nombre</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              ) : (
                <p>{formData.firstName || user?.username || "No especificado"}</p>
              )}
            </div>
          </div>

          {/* Apellido */}
          <div className="dataItem">
            <FiUser className="itemIcon" />
            <div className="inputGroup">
              <label>Apellido</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              ) : (
                <p>{formData.lastName || "No especificado"}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="dataItem disabled">
            <FiMail className="itemIcon" />
            <div className="inputGroup">
              <label>Correo Electrónico (No editable)</label>
              <p>{user?.email || "-"}</p>
            </div>
          </div>

          {/* Teléfono */}
          <div className="dataItem">
            <FiPhone className="itemIcon" />
            <div className="inputGroup">
              <label>Teléfono / Celular</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              ) : (
                <p>{formData.phone || "No especificado"}</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="dataItem">
            <FiMapPin className="itemIcon" />
            <div className="inputGroup">
              <label>Dirección de Entrega</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              ) : (
                <p>{formData.address || "No especificada"}</p>
              )}
            </div>
          </div>

          {/* Distrito */}
          <div className="dataItem">
            <FiGlobe className="itemIcon" />
            <div className="inputGroup">
              <label>Distrito</label>
              {isEditing ? (
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                />
              ) : (
                <p>{formData.district || "No especificado"}</p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="actionsContainer">
            {isEditing ? (
              <>
                <button type="submit" className="btnSave" disabled={loading}>
                  <FiSave /> {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                  type="button"
                  className="btnCancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btnEdit"
                onClick={handleStartEdit}
              >
                <FiEdit2 /> Editar Mis Datos
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;