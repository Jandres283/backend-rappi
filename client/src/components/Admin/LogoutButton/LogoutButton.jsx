// src/components/Admin/LogoutButton/LogoutButton.jsx
import { useState } from "react";
import "./LogoutButton.scss";

const LogoutButton = ({ onLogout }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      // Cancela el estado de confirmación tras 3 segundos si no se presiona de nuevo
      setTimeout(() => setIsConfirming(false), 3000);
    } else {
      if (onLogout) onLogout();
    }
  };

  return (
    <button
      type="button"
      className={`logout-button ${isConfirming ? "logout-button--confirming" : ""}`}
      onClick={handleClick}
    >
      {isConfirming ? "¿Confirmar salida?" : "Cerrar Sesión"}
    </button>
  );
};

export default LogoutButton;