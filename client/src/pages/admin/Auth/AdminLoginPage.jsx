import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginForm from "@/components/Admin/Auth/AdminLoginForm";
// ✅ Importación por defecto corregida (sin llaves)
import useAuth from "@/context/AuthContext";
import api from "@/api/axios";
import "./AdminLoginPage.scss";

export const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [formKey, setFormKey] = useState(0);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuthSubmit = async (data) => {
    setLoading(true);
    setStatusMessage('');

    const endpoint = data.isRegister 
      ? "/auth/registerAdmin" 
      : "/auth/login";

    const payload = data.isRegister
      ? {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone,
          district: data.district,
          address: data.address,
          role: 'admin',
        }
      : {
          email: data.email,
          password: data.password,
        };

    try {
      const response = await api.post(endpoint, payload);
      const result = response.data;

      if (data.isRegister) {
        setStatusMessage("¡Registro exitoso! Administrador creado correctamente.");
        setFormKey((prevKey) => prevKey + 1);
      } else {
        setStatusMessage(`Autenticando usuario...`);
        
        // 1. Extraer el token de acceso
        const userToken = result.access || result.accessToken || result.token;

        if (!userToken) {
          throw new Error("No se recibió un token válido del servidor.");
        }

        // Guardar tokens de inmediato en LocalStorage
        localStorage.setItem("token", userToken);
        localStorage.setItem("accessToken", userToken);

        // 2. Extraer usuario que ya envía la respuesta del backend
        let userData = result.user || result.admin || result.data;

        // Si no vino dentro de la respuesta, intentamos /auth/me de forma segura
        if (!userData) {
          try {
            const profileRes = await api.get('/auth/me', {
              headers: { Authorization: `Bearer ${userToken}` }
            });
            userData = profileRes.data?.user || profileRes.data;
          } catch (e) {
            console.warn("No se pudo obtener el perfil completo, usando datos básicos:", e);
            userData = { email: data.email, role: 'admin' };
          }
        } else {
          userData = { ...userData, role: userData.role || 'admin' };
        }

        localStorage.setItem("user", JSON.stringify(userData));

        // 3. Activar sesión en AuthContext
        if (login) {
          await login(userData, userToken);
        }

        setStatusMessage("¡Bienvenido! Redirigiendo al panel...");

        // 4. Redirigir suavemente
        setTimeout(() => {
          navigate("/admin/orders", { replace: true });
        }, 300);
      }

    } catch (error) {
      console.error("Error de autenticación/registro:", error);
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || error.message || "Error al conectar con el servidor.";
      setStatusMessage(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-page__overlay">
        
        <div className="admin-login-page__branding">
          <div className="brand-header">
            <div className="logo-pill">
              <span className="brand-name">APEX OPS</span>
            </div>
            <span className="admin-badge">ADMIN</span>
          </div>

          <div className="hero-text">
            <h1>Centro de Control <span>Administrativo</span></h1>
            <p>
              Monitorea la plataforma, supervisa la flota de repartidores y gestiona
              pedidos globales en tiempo real.
            </p>
          </div>

          <div className="console-hud-card">
            <div className="console-hud-card__top">
              <span className="console-title">Consola de Operaciones</span>
              <div className="live-status">
                <span className="ping-dot"></span>
                <span>EN VIVO</span>
              </div>
            </div>

            <div className="console-hud-card__metrics">
              <div className="metric-item border-teal">
                <span className="metric-value">99.98%</span>
                <span className="metric-label">Uptime Servidores</span>
              </div>
              <div className="metric-item border-teal">
                <span className="metric-value">12 ms</span>
                <span className="metric-label">Latencia Red</span>
              </div>
              <div className="metric-item border-orange">
                <span className="metric-value">1,482</span>
                <span className="metric-label">Pedidos / Min</span>
              </div>
              <div className="metric-item border-orange">
                <span className="metric-value">842</span>
                <span className="metric-label">Repartidores Activos</span>
              </div>
            </div>

            <div className="console-hud-card__footer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Conexión segura TLS 1.3 End-to-End</span>
            </div>
          </div>
        </div>

        <div className="admin-login-page__content">
          <AdminLoginForm 
            key={formKey}
            onSubmit={handleAuthSubmit} 
            isLoading={loading} 
            statusMessage={statusMessage} 
          />
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;