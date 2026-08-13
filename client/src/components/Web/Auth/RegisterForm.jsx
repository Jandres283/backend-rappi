import { useState } from "react";
import { 
  FiMail, 
  FiLock, 
  FiUser, 
  FiMapPin, 
  FiEye, 
  FiEyeOff, 
  FiPhone 
} from "react-icons/fi";
import "./Auth.scss";

export const RegisterForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    distrito: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form className="auth-form-container" onSubmit={handleSubmit}>
      {/* Email */}
      <div className="form-group">
        <label htmlFor="reg-email">Correo Electrónico</label>
        <div className="input-wrapper">
          <FiMail className="input-icon" />
          <input
            id="reg-email"
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Password */}
      <div className="form-group">
        <label htmlFor="reg-password">Contraseña</label>
        <div className="input-wrapper">
          <FiLock className="input-icon" />
          <input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="btn-toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      {/* Nombre y Apellido */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reg-nombre">Nombre</label>
          <div className="input-wrapper">
            <FiUser className="input-icon" />
            <input
              id="reg-nombre"
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reg-apellido">Apellido</label>
          <div className="input-wrapper">
            <FiUser className="input-icon" />
            <input
              id="reg-apellido"
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Teléfono y Distrito */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="reg-telefono">Teléfono</label>
          <div className="input-wrapper">
            <FiPhone className="input-icon" />
            <input
              id="reg-telefono"
              type="tel"
              name="telefono"
              placeholder="987654321"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reg-distrito">Distrito</label>
          <div className="input-wrapper">
            <FiMapPin className="input-icon" />
            <input
              id="reg-distrito"
              type="text"
              name="distrito"
              placeholder="Ej. Miraflores"
              value={formData.distrito}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div className="form-group">
        <label htmlFor="reg-direccion">Dirección</label>
        <div className="input-wrapper">
          <FiMapPin className="input-icon" />
          <input
            id="reg-direccion"
            type="text"
            name="direccion"
            placeholder="Av. Principal 123"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Botón Submit */}
      <button type="submit" className="btn-submit-auth" disabled={isLoading}>
        {isLoading ? "Creando..." : "Registrarse"}
      </button>
    </form>
  );
};

export default RegisterForm;