import { useState } from 'react';
import './AdminLoginForm.scss';

const AdminLoginForm = ({ onSubmit, isLoading, statusMessage }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    district: '',
    address: '',
    role: 'admin'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTabSwitch = (toRegister) => {
    setIsRegister(toRegister);
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isRegister) {
      if (!formData.firstName.trim() || !formData.phone.trim()) {
        setErrorMessage('El nombre y el teléfono son requeridos para registrarse.');
        return;
      }
    }

    if (onSubmit) {
      onSubmit({ ...formData, isRegister });
    }
  };

  return (
    <div className="admin-auth-card">
      <div className="admin-auth-card__header">
        <h3>{isRegister ? 'Registro Admin' : 'Acceso Admin'}</h3>
        <div className="tab-buttons">
          <button
            type="button"
            className={`tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => handleTabSwitch(false)}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => handleTabSwitch(true)}
          >
            Registrarme
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="admin-auth-card__error">{errorMessage}</div>
      )}

      {statusMessage && (
        <div className={`admin-auth-card__status ${statusMessage.toLowerCase().includes('error') ? 'is-error' : 'is-success'}`}>
          {statusMessage}
        </div>
      )}

      <form className="admin-auth-card__form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Mostrar u ocultar contraseña"
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
        </div>

        {isRegister && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  required={isRegister}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="987654321"
                  value={formData.phone}
                  onChange={handleChange}
                  required={isRegister}
                />
              </div>
              <div className="form-group">
                <label htmlFor="district">Distrito</label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  placeholder="Ej. Miraflores"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Dirección</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Av. Principal 123"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button type="submit" className="submit-orange-btn" disabled={isLoading}>
          {isLoading ? 'Procesando...' : isRegister ? 'Crear cuenta' : 'Iniciar Sesión'}
        </button>

        <div className="switch-mode-text">
          {isRegister ? (
            <>
              ¿Ya tienes cuenta?{' '}
              <span onClick={() => handleTabSwitch(false)}>Inicia sesión</span>
            </>
          ) : (
            <>
              ¿No tienes cuenta admin?{' '}
              <span onClick={() => handleTabSwitch(true)}>Regístrate</span>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminLoginForm;