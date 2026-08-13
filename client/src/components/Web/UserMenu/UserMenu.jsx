import { useState, useRef, useEffect } from "react";
import { 
  FiUser, 
  FiShoppingBag, 
  FiLogOut, 
  FiChevronDown, 
  FiFileText 
} from "react-icons/fi";

// ✅ Importación por defecto (sin llaves)
import useAuth from "@/context/AuthContext";
import "./UserMenu.scss";

const cleanAndFormatName = (rawName) => {
  if (!rawName || typeof rawName !== "string") return "";
  
  const cleaned = rawName.replace(/[0-9_.-]/g, " ").trim();
  if (!cleaned) return "";

  return cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const extractDisplayName = (userObj) => {
  if (!userObj) return "Usuario";

  let u = userObj;
  if (typeof u === "string") {
    try {
      u = JSON.parse(u);
    } catch {
      return cleanAndFormatName(u) || "Usuario";
    }
  }

  const target = u?.user || u?.userData || u?.client || u?.data?.user || u?.data || u;

  const firstName = target?.firstName || target?.firstname || target?.nombre || target?.first_name || u?.firstName;
  const lastName = target?.lastName || target?.lastname || target?.apellido || target?.last_name || u?.lastName;

  if (firstName && lastName) {
    const fullName = `${firstName} ${lastName}`;
    const cleaned = cleanAndFormatName(fullName);
    if (cleaned) return cleaned;
  }

  const realNameCandidates = [
    firstName,
    target?.fullName,
    target?.fullname,
    target?.name,
    u?.fullName,
    u?.name,
  ];

  for (const val of realNameCandidates) {
    if (
      val && 
      typeof val === "string" && 
      val.trim() !== "" && 
      !["usuario", "undefined", "null", "none"].includes(val.trim().toLowerCase())
    ) {
      const cleaned = cleanAndFormatName(val);
      if (cleaned) return cleaned;
    }
  }

  const rawFallback =
    target?.username ||
    u?.username ||
    (target?.email ? target.email.split("@")[0] : null) ||
    (u?.email ? u.email.split("@")[0] : null);

  if (rawFallback && typeof rawFallback === "string") {
    const cleaned = cleanAndFormatName(rawFallback);
    if (cleaned) return cleaned;
  }

  return "Usuario";
};

const formatRole = (role) => {
  if (!role || typeof role !== "string") return "Cliente";
  const r = role.toLowerCase();
  if (r === "admin" || r === "administrator") return "Administrador";
  if (r === "driver" || r === "repartidor") return "Repartidor";
  if (r === "restaurant" || r === "restaurante") return "Restaurante";
  if (r === "client" || r === "cliente") return "Cliente";
  return cleanAndFormatName(role);
};

export const UserMenu = ({ user: propUser, onLogout, onOpenOrders, onOpenProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  const { user: contextUser, logout: contextLogout } = useAuth();
  const activeUser = propUser || contextUser;

  const displayName = extractDisplayName(activeUser);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    if (onLogout) {
      onLogout();
    } else if (contextLogout) {
      contextLogout();
    } else {
      localStorage.clear();
      window.dispatchEvent(new Event("auth-change"));
    }
  };

  const emailDisplay = 
    activeUser?.email || 
    activeUser?.user?.email || 
    activeUser?.userData?.email || 
    "Sin correo";

  const rawRole = 
    activeUser?.role || 
    activeUser?.user?.role || 
    "client";

  const roleDisplay = formatRole(rawRole);

  return (
    <div className="userMenuContainer" ref={menuRef}>
      <button 
        className={`userPillBtn ${isOpen ? "active" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <div className="userInfo">
          <FiUser className="userIcon" />
          <span className="userName">Hola, {displayName}</span>
        </div>
        <FiChevronDown className={`chevronIcon ${isOpen ? "rotate" : ""}`} />
      </button>

      {isOpen && (
        <div className="userDropdown">
          <div className="dropdownHeader">
            <p className="userEmail">{emailDisplay}</p>
            <span className="userRole">{roleDisplay}</span>
          </div>

          <div className="dropdownDivider" />

          <ul className="dropdownMenu">
            <li>
              <button 
                type="button" 
                onClick={() => { setIsOpen(false); onOpenOrders && onOpenOrders(); }}
              >
                <FiShoppingBag className="optionIcon" />
                <span>Historial de Pedidos</span>
              </button>
            </li>

            <li>
              <button 
                type="button" 
                onClick={() => { setIsOpen(false); onOpenProfile && onOpenProfile(); }}
              >
                <FiFileText className="optionIcon" />
                <span>Mis Datos de Registro</span>
              </button>
            </li>
          </ul>

          <div className="dropdownDivider" />

          <button 
            type="button" 
            className="btnLogout" 
            onClick={handleLogout}
          >
            <FiLogOut className="optionIcon" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;