

export const AvailabilitySwitch = ({ isAvailable, onToggle, isLoading }) => {
  const handleToggle = () => {
    if (onToggle && !isLoading) {
      onToggle(!isAvailable);
    }
  };

  return (
    <div className="availability-switch-container">
      <div className="switch-info">
        <span
          className={`status-indicator ${isAvailable ? "online" : "offline"}`}
        />
        <span>
          Estado: <strong>{isAvailable ? "Conectado" : "Desconectado"}</strong>
        </span>
      </div>

      <button
        type="button"
        className={`btn-toggle-switch ${
          isAvailable ? "is-online" : "is-offline"
        }`}
        onClick={handleToggle}
        disabled={isLoading}
      >
        {isLoading
          ? "Actualizando..."
          : isAvailable
          ? "🔴 Pasar a Inactivo"
          : "🟢 Iniciar Turno"}
      </button>
    </div>
  );
};

export default AvailabilitySwitch;