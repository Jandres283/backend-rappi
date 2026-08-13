import { useState } from "react";

const VehicleInfoForm = ({ initialData, onSubmit, isLoading }) => {
  // Inicialización limpia sin necesidad de useEffect
  const [vehicle, setVehicle] = useState({
    vehicleType: initialData?.vehicleType || initialData?.type || "Motocicleta",
    vehiclePlate: initialData?.vehiclePlate || initialData?.licensePlate || "",
    model: initialData?.model || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(vehicle);
    }
  };

  return (
    <form className="vehicle-info-form" onSubmit={handleSubmit}>
      <h3>Datos del Vehículo</h3>

      <div className="form-group">
        <label htmlFor="vehicle-type">Tipo de Vehículo</label>
        <select
          id="vehicle-type"
          name="vehicleType"
          value={vehicle.vehicleType}
          onChange={handleChange}
        >
          <option value="Motocicleta">Motocicleta</option>
          <option value="Bicicleta">Bicicleta</option>
          <option value="Automóvil">Automóvil</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="vehicle-plate">Placa / Matrícula</label>
        <input
          id="vehicle-plate"
          type="text"
          name="vehiclePlate"
          value={vehicle.vehiclePlate}
          onChange={handleChange}
          placeholder="ABC-123"
        />
      </div>

      <div className="form-group">
        <label htmlFor="vehicle-model">Modelo / Marca</label>
        <input
          id="vehicle-model"
          type="text"
          name="model"
          value={vehicle.model}
          onChange={handleChange}
          placeholder="Ej: Honda Wave 110"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Actualizar Vehículo"}
      </button>
    </form>
  );
};

export default VehicleInfoForm;