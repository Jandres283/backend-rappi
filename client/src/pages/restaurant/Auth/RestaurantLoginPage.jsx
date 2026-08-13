import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiBarChart2, 
  FiBookOpen, 
  FiTruck, 
  FiWifi, 
  FiMail, 
  FiEye, 
  FiEyeOff, 
  FiShield,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth } from '@/hooks';
import api from '@/api/axios'; // 👈 Se utiliza la instancia centralizada de Axios
import './RestaurantAuth.scss';

// Función auxiliar para formatear nombres a partir del correo si no viene 'name' en la API
const formatNameFromEmail = (email) => {
  if (!email) return 'Restaurante Aliado';
  const handle = email.split('@')[0];
  if (handle === 'contacto' || handle === 'admin' || handle === 'info' || handle === 'socio') {
    const domain = email.split('@')[1]?.split('.')[0];
    if (domain) return domain.charAt(0).toUpperCase() + domain.slice(1);
  }
  return handle.charAt(0).toUpperCase() + handle.slice(1);
};

export const RestaurantLoginPage = () => {
  const { login } = useAuth() || {}; 
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      // 📡 Petición enviada mediante axios centralizado (se ajusta automáticamente al puerto de tu backend)
      const response = await api.post('/auth/login', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      });

      const result = response.data;

      // 1. Guardar Tokens
      const token = result.access || result.token || result.accessToken;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('accessToken', token);
      }
      if (result.refresh) {
        localStorage.setItem('refreshToken', result.refresh);
      }

      // 2. Extraer datos dinámicos del restaurante ingresado
      const rawObj = result.user || result.restaurant || result.data || result || {};

      const restaurantId = 
        rawObj._id || 
        rawObj.id || 
        rawObj.restaurantId || 
        (rawObj.restaurant && (rawObj.restaurant._id || rawObj.restaurant.id));

      const restaurantEmail = rawObj.email || formData.email;

      // Búsqueda del Nombre del Comercio (o formateado a partir del correo)
      const restaurantName = 
        rawObj.name || 
        rawObj.restaurantName || 
        rawObj.title || 
        (rawObj.restaurant && rawObj.restaurant.name) ||
        formatNameFromEmail(restaurantEmail);

      const userData = {
        _id: restaurantId,
        id: restaurantId,
        name: restaurantName,
        email: restaurantEmail,
        role: 'restaurant'
      };

      // Guardar en Storage para persistencia
      localStorage.setItem('user', JSON.stringify(userData));
      if (restaurantId) {
        localStorage.setItem('restaurantId', String(restaurantId));
      }

      // Notificar al contexto global de autenticación
      if (login && typeof login === 'function') {
        await login(token, userData);
      }

      setStatusMessage({
        type: 'success',
        text: `¡Bienvenido ${restaurantName}! Entrando a tu panel...`
      });

      // Redirigir suavemente al dashboard
      setTimeout(() => {
        navigate('/restaurant/dashboard');
      }, 600);

    } catch (error) {
      console.error('Error de login:', error);

      // Captura el mensaje exacto del Backend si existe
      const backendMessage = 
        error.response?.data?.msg || 
        error.response?.data?.message || 
        'Credenciales no válidas o correo/contraseña erróneos.';

      setStatusMessage({
        type: 'error',
        text: backendMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="restaurant-auth-page-container">
      <div className="auth-content-wrapper">
        
        {/* SECCIÓN IZQUIERDA: HERO E INFOGRAFÍA */}
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
          <div className="auth-card">
            
            <div className="tabs-container">
              <span className="tab-btn active">Ingresar</span>
              <Link to="/restaurant/register" className="tab-btn inactive">
                Registrarse
              </Link>
            </div>

            <div className="form-header">
              <h2>¡Hola de nuevo! 👋</h2>
              <p>Ingresa tus credenciales para administrar tu restaurante</p>
            </div>

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

            <form className="auth-form-content" onSubmit={handleSubmit}>
              
              <div className="input-group">
                <label htmlFor="email">Correo Electrónico</label>
                <div className="input-field">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="contacto@turestaurante.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <FiMail className="field-icon" />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Contraseña</label>
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

              <div className="forgot-password-link">
                <a href="#forgot">¿Olvidaste tu contraseña?</a>
              </div>

              <button type="submit" className="btn-rappi-submit" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="card-footer-separator">
              <div className="divider">
                <span>O accede con</span>
              </div>
              <button type="button" className="btn-alt-code">
                <FiShield /> Acceso con Código OTP
              </button>
            </div>

            <div className="card-footer-redirect">
              <p>
                ¿Aún no tienes cuenta?{' '}
                <Link to="/restaurant/register">Regístrate aquí</Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default RestaurantLoginPage;