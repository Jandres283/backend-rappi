import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiBarChart2, 
  FiBookOpen, 
  FiTruck, 
  FiWifi, 
  FiMail, 
  FiUser, 
  FiPhone, 
  FiMapPin, 
  FiGrid, 
  FiEye, 
  FiEyeOff, 
  FiImage,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import './RestaurantAuth.scss';

export const RestaurantRegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estado para alertas dentro de la interfaz (sin alert emergente)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    storeName: '',
    ownerFirstName: '',
    ownerLastName: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    password: '',
    logo: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' }); // Limpiar alertas previas

    try {
      const data = new FormData();

      // Campos de texto van PRIMERO
      data.append('name', formData.storeName);
      data.append('firstName', formData.ownerFirstName);
      data.append('lastName', formData.ownerLastName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('category', formData.category);
      data.append('password', formData.password);

      // La imagen va al FINAL
      if (formData.logo) {
        data.append('image', formData.logo);
      }

      const response = await fetch('http://localhost:3977/api/v1/restaurant/register', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        // Mensaje de éxito dentro de la misma tarjeta
        setStatusMessage({
          type: 'success',
          text: '¡Registro guardado con éxito! Redirigiendo al inicio de sesión...',
        });

        // Espera 2 segundos para que el usuario vea el mensaje y luego redirige
        setTimeout(() => {
          navigate('/restaurant/login');
        }, 2000);
      } else {
        // Mensaje de error dentro de la misma tarjeta
        setStatusMessage({
          type: 'error',
          text: result.msg || 'Error al completar el registro del restaurante.',
        });
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setStatusMessage({
        type: 'error',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="restaurant-auth-page-container">
      <div className="auth-content-wrapper">
        
        {/* SECCIÓN IZQUIERDA: INFOGRAFÍA Y HERO */}
        <div className="hero-infographic-section">
          <div className="brand-header">
            <span className="brand-badge">● Portal Aliados</span>
            <h1 className="brand-logo">
              Rappi <span>RESTAURANT</span>
            </h1>
            <p className="brand-subtitle">
              La plataforma inteligente que conecta tu restaurante con miles de clientes.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-wrapper"><FiShoppingBag /></div>
              <h4>Gestión de Pedidos</h4>
              <p>Administra y monitorea todos tus pedidos en tiempo real.</p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper"><FiBarChart2 /></div>
              <h4>Métricas en Vivo</h4>
              <p>Conoce el rendimiento de tu restaurante al instante.</p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper"><FiBookOpen /></div>
              <h4>Menú Inteligente</h4>
              <p>Actualiza, organiza y optimiza tu menú fácilmente.</p>
            </div>

            <div className="feature-card">
              <div className="icon-wrapper"><FiTruck /></div>
              <h4>Envíos Eficientes</h4>
              <p>Conéctate con Rappi y llega a más clientes rápidamente.</p>
            </div>
          </div>

          <div className="status-banner">
            <div className="status-indicator">
              <span className="dot"></span>
              <strong>TODO BAJO CONTROL</strong>
            </div>
            <p>Conexión en tiempo real con la red de pedidos de Rappi.</p>
            <span className="wifi-icon"><FiWifi /></span>
          </div>
        </div>

        {/* SECCIÓN DERECHA: FORMULARIO */}
        <div className="form-card-section">
          <div className="auth-card register-card">
            
            <div className="tabs-container">
              <Link to="/restaurant/login" className="tab-btn inactive">
                Iniciar Sesión
              </Link>
              <span className="tab-btn active">Registrarme</span>
            </div>

            <div className="form-header">
              <h2>Registrar Nuevo Restaurante</h2>
              <p>Únete a nuestra red de socios y haz crecer tu negocio.</p>
            </div>

            {/* BANNER DE NOTIFICACIÓN EN LA MISMA TARJETA */}
            {statusMessage.text && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  backgroundColor: statusMessage.type === 'success' ? '#e6f4ea' : '#fce8e6',
                  color: statusMessage.type === 'success' ? '#137333' : '#c5221f',
                  border: `1px solid ${statusMessage.type === 'success' ? '#ceedd5' : '#f5c6cb'}`
                }}
              >
                {statusMessage.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form className="auth-form-content grid-form" onSubmit={handleSubmit}>
              
              {/* Nombre Establecimiento */}
              <div className="input-group">
                <label htmlFor="storeName">Nombre del Establecimiento *</label>
                <div className="input-field">
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    placeholder="Ej. Taquería El Pastor"
                    value={formData.storeName}
                    onChange={handleChange}
                    required
                  />
                  <FiShoppingBag className="field-icon" />
                </div>
              </div>

              {/* Nombre Encargado */}
              <div className="input-group">
                <label htmlFor="ownerFirstName">Nombre Encargado *</label>
                <div className="input-field">
                  <input
                    type="text"
                    id="ownerFirstName"
                    name="ownerFirstName"
                    placeholder="Nombre"
                    value={formData.ownerFirstName}
                    onChange={handleChange}
                    required
                  />
                  <FiUser className="field-icon" />
                </div>
              </div>

              {/* Apellido Encargado */}
              <div className="input-group">
                <label htmlFor="ownerLastName">Apellido Encargado *</label>
                <div className="input-field">
                  <input
                    type="text"
                    id="ownerLastName"
                    name="ownerLastName"
                    placeholder="Apellido"
                    value={formData.ownerLastName}
                    onChange={handleChange}
                    required
                  />
                  <FiUser className="field-icon" />
                </div>
              </div>

              {/* Correo Electrónico */}
              <div className="input-group">
                <label htmlFor="email">Correo Electrónico *</label>
                <div className="input-field">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="contacto@restaurante.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <FiMail className="field-icon" />
                </div>
              </div>

              {/* Teléfono */}
              <div className="input-group">
                <label htmlFor="phone">Teléfono *</label>
                <div className="input-field">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+51 987654321"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <FiPhone className="field-icon" />
                </div>
              </div>

              {/* Dirección */}
              <div className="input-group">
                <label htmlFor="address">Dirección *</label>
                <div className="input-field">
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Av. Principal #123"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  <FiMapPin className="field-icon" />
                </div>
              </div>

              {/* Categoría */}
              <div className="input-group">
                <label htmlFor="category">Categoría *</label>
                <div className="input-field">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="polleria">Pollerías & Brasas</option>
                    <option value="criolla">Comida Criolla & Peruana</option>
                    <option value="chifa">Chifa & Comida China</option>
                    <option value="pizzeria">Pizzas & Pastas</option>
                    <option value="hamburguesas">Hamburguesas & Fast Food</option>
                    <option value="mariscos">Cebicherías & Mariscos</option>
                    <option value="sushi">Sushi & Asiática</option>
                    <option value="mexicana">Comida Mexicana</option>
                    <option value="italiana">Italiana & Pastas</option>
                    <option value="postres">Postres & Cafetería</option>
                  </select>
                  <FiGrid className="field-icon" />
                </div>
              </div>

              {/* Contraseña */}
              <div className="input-group">
                <label htmlFor="password">Contraseña *</label>
                <div className="input-field">
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
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Logotipo / Foto */}
              <div className="input-group full-span">
                <label htmlFor="logo">Logotipo o Foto del Restaurante</label>
                <div className="input-field">
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <FiImage className="field-icon" />
                </div>
              </div>

              {/* Botón Submit */}
              <button type="submit" className="btn-rappi-submit full-span" disabled={loading}>
                {loading ? 'Procesando Registro...' : 'Solicitar Registro →'}
              </button>
            </form>

            <div className="card-footer-redirect">
              <p>
                ¿Ya tienes una cuenta?{' '}
                <Link to="/restaurant/login">Inicia sesión aquí</Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RestaurantRegisterPage;