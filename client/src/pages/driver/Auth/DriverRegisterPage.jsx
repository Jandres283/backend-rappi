import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENV } from "@/utils";
import "./Auth.scss";

const API_BASE_URL = ENV?.API_URL || "http://localhost:3977/api/v1";

export const DriverRegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    vehicleType: "MOTORCYCLE",
    licensePlate: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        firstName: formData.firstname.trim(),
        firstname: formData.firstname.trim(),
        lastName: formData.lastname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        vehicleType: formData.vehicleType,
        vehiclePlate: formData.vehicleType === "BICYCLE" ? null : formData.licensePlate.trim(),
        licensePlate: formData.vehicleType === "BICYCLE" ? null : formData.licensePlate.trim(),
        plate: formData.vehicleType === "BICYCLE" ? null : formData.licensePlate.trim(),
        password: formData.password,
        role: "DRIVER",
      };

      const response = await fetch(`${API_BASE_URL}/auth/registerDriver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || result.message || "Error al registrar la cuenta.");
      }

      setSuccessMessage(result.msg || "¡Registro exitoso! Redirigiendo al inicio de sesión...");

      setTimeout(() => {
        navigate("/driver/login");
      }, 2000);

    } catch (err) {
      setErrorMessage(err.message || "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="driver-auth">
      <div className="auth-container">
        {/* PANEL IZQUIERDO */}
        <div className="info-section">
          <div className="svg-background-shape">
            <svg viewBox="0 0 600 1000" preserveAspectRatio="none">
              <path d="M 0,0 L 460,0 C 570,200 520,450 420,600 C 340,720 380,880 520,1000 L 0,1000 Z" fill="#FF5722" />
              <path d="M 0,0 L 430,0 C 540,200 490,450 390,600 C 340,720 380,880 520,1000 L 0,1000 Z" fill="#FAF6F0" />
            </svg>
          </div>

          <div className="info-section__content">
            <div className="status-badge">
              <span className="dot">●</span>
              SISTEMA LOGÍSTICO RAPPI DRIVER
            </div>

            <h1 className="brand-title">
              Maneja tu tiempo, <br />
              <span className="orange-text">Aumenta tus Ganancias</span>
            </h1>

            <p className="brand-description">
              Súmate a la red líder de entregas. Conéctate cuando quieras y recibe pedidos de las mejores marcas y restaurantes de tu ciudad.
            </p>

            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="benefit-text">
                  <h4>Pagos Semanales Garantizados</h4>
                  <p>Transfiere tus ganancias acumuladas con total seguridad y rapidez.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="benefit-text">
                  <h4>Rutas Inteligentes</h4>
                  <p>Algoritmos de navegación optimizados para minimizar tus tiempos de viaje.</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="benefit-text">
                  <h4>Soporte en Ruta 24/7</h4>
                  <p>Asistencia prioritaria en tiempo real durante cada una de tus entregas.</p>
                </div>
              </div>
            </div>

            <div className="system-footer-code">RAPPI_DRIVER_V2.0</div>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="illustration-section">
          <div className="glass-login-box">
            <div className="glass-login-box__header">
              <h3>Rappi Driver</h3>
              <div className="brand-logo-badge"></div>
            </div>

            <div className="tabs">
              <button 
                type="button" 
                onClick={() => navigate("/driver/login")}
              >
                Iniciar Sesión
              </button>
              <button 
                type="button" 
                className="active"
                onClick={() => navigate("/driver/register")}
              >
                Registrarme
              </button>
            </div>

            {errorMessage && <div className="error-banner">{errorMessage}</div>}
            {successMessage && <div className="success-banner">{successMessage}</div>}

            <form className="is-register" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="reg-firstname">Nombres</label>
                  <input
                    type="text"
                    id="reg-firstname"
                    name="firstname"
                    placeholder="Ej. Carlos"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="reg-lastname">Apellidos</label>
                  <input
                    type="text"
                    id="reg-lastname"
                    name="lastname"
                    placeholder="Ej. Rodríguez"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group full-width">
                  <label htmlFor="reg-email">Correo Electrónico</label>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    placeholder="driver@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group full-width">
                  <label htmlFor="reg-phone">Teléfono</label>
                  <input
                    type="tel"
                    id="reg-phone"
                    name="phone"
                    placeholder="+51 987 654 321"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="reg-vehicleType">Vehículo</label>
                  <select
                    id="reg-vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                  >
                    <option value="MOTORCYCLE">Motocicleta</option>
                    <option value="BICYCLE">Bicicleta</option>
                    <option value="CAR">Automóvil</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="reg-licensePlate">Placa</label>
                  <input
                    type="text"
                    id="reg-licensePlate"
                    name="licensePlate"
                    placeholder="ABC-123"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    required={formData.vehicleType !== "BICYCLE"}
                    disabled={formData.vehicleType === "BICYCLE"}
                  />
                </div>

                <div className="input-group full-width">
                  <label htmlFor="reg-password">Contraseña</label>
                  <input
                    type="password"
                    id="reg-password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Registrando..." : "Completar Registro →"}
              </button>
            </form>
          </div>
        </div>
      </div> 
    </div>
  );
};