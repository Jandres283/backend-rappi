import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

export const LoginForm = ({ onSubmit, isLoading }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(credentials);
  };

  return (
    <form className="authFormContainer" onSubmit={handleSubmit}>
      {/* Campo Email */}
      <div className="formGroup">
        <label htmlFor="login-email">Correo Electrónico</label>
        <div className="inputWrapper">
          <FiMail className="inputIcon" />
          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="ejemplo@correo.com"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Campo Contraseña */}
      <div className="formGroup">
        <label htmlFor="login-password">Contraseña</label>
        <div className="inputWrapper">
          <FiLock className="inputIcon" />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="btnTogglePassword"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label="Mostrar u ocultar contraseña"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      {/* Botón Principal */}
      <button type="submit" className="submitBtn" disabled={isLoading}>
        {isLoading ? "Cargando..." : "Iniciar Sesión"}
      </button>

      {/* Olvidaste Contraseña */}
      <div className="authForgot">
        <a href="#forgot">¿Olvidaste tu contraseña?</a>
      </div>
    </form>
  );
};

export default LoginForm; 