import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Contexto de autenticación
import { useAuth } from "../../../context"; 

// Subcomponente Formulario de Login (Ruta corregida apuntando a components)
import LoginForm from "../../../components/Web/Auth/LoginForm";

// Iconos
import { 
  FiMail, 
  FiLock, 
  FiUser, 
  FiMapPin, 
  FiEye, 
  FiEyeOff, 
  FiPackage,
  FiX,
  FiPhone
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";

// Estilos SCSS (Ruta corregida coincidiendo con el nombre real del archivo)
import "./AuthPage.scss"; 

// URL de la API (compatible con variables de entorno de Vite)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3977/api/v1"; 

// Helper para decodificar JWT sin librerías externas
const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthPage = ({ isOpen = true, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    direccion: "",
    distrito: "",
    telefono: "",
  });

  const handleClose = (e) => {
    if (e) e.stopPropagation();
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  if (!isOpen) return null;

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (credentialsPayload, isRegisterAction = false) => {
    setErrorMsg("");
    setLoading(true);

    try {
      const endpoint = isRegisterAction 
        ? `${API_URL}/auth/registerClient`
        : `${API_URL}/auth/login`;

      const payload = isRegisterAction
        ? {
            firstName: registerData.nombre,
            lastName: registerData.apellido,
            email: registerData.email,
            password: registerData.password,
            address: registerData.direccion,
            district: registerData.distrito,
            phone: registerData.telefono,
          }
        : credentialsPayload;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      let data = {};
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Tu cuenta está inactiva. Verifica el estado en la base de datos.");
        }
        throw new Error(data.msg || data.message || `Error del servidor (${response.status})`);
      }

      const token = data.accessToken || data.access || data.token;
      const tokenPayload = token ? decodeToken(token) : {};

      let rawUser = data.user || data.userData || data.client || data.usuario || tokenPayload;
      if (!rawUser && (data.firstName || data.nombre || data.name || data.email || data._id)) {
        rawUser = data; 
      }

      const extractedName = 
        rawUser?.firstName || 
        rawUser?.nombre || 
        rawUser?.name || 
        rawUser?.first_name || 
        (isRegisterAction ? registerData.nombre : null) || 
        (rawUser?.email || credentialsPayload?.email || registerData.email || "").split("@")[0] || 
        "Usuario";

      const normalizedUser = {
        ...(typeof rawUser === "object" ? rawUser : {}),
        email: rawUser?.email || credentialsPayload?.email || registerData.email,
        firstName: extractedName,
        nombre: extractedName,
        name: extractedName,
      };

      login(token, normalizedUser);

      if (onLoginSuccess) onLoginSuccess(normalizedUser);
      handleClose();

    } catch (err) {
      console.error("Auth Error:", err);
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        setErrorMsg("No se pudo conectar con el servidor backend (Puerto 3977).");
      } else {
        setErrorMsg(err.message || "Error al procesar la solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authModalOverlay" onClick={handleClose}>
      <div className="authCard" onClick={(e) => e.stopPropagation()}>
        
        <button 
          type="button" 
          className="btnClose" 
          onClick={handleClose}
          aria-label="Cerrar modal"
        >
          <FiX />
        </button>

        <div className="authHeader">
          <div className="logoWrapper">
            <FiPackage className="logoIcon" />
            <span className="logoText">Rappi</span>
          </div>
          <h3>¡Te damos la bienvenida a Rappi!</h3>
          <p>{isLogin ? "Ingresa tus datos para hacer o gestionar pedidos" : "Crea tu cuenta de cliente"}</p>
        </div>

        <div className="authTabs">
          <button
            type="button"
            className={`tabBtn ${isLogin ? "active" : ""}`}
            onClick={() => { setIsLogin(true); setErrorMsg(""); }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`tabBtn ${!isLogin ? "active" : ""}`}
            onClick={() => { setIsLogin(false); setErrorMsg(""); }}
          >
            Registrarse
          </button>
        </div>

        {errorMsg && <div className="errorAlert">{errorMsg}</div>}

        {isLogin ? (
          <LoginForm 
            onSubmit={(creds) => handleAuthSubmit(creds, false)} 
            isLoading={loading} 
          />
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleAuthSubmit(null, true); }}>
            <div className="formGroup">
              <label htmlFor="reg-email">Correo Electrónico</label>
              <div className="inputWrapper">
                <FiMail className="inputIcon" />
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
            </div>

            <div className="formGroup">
              <label htmlFor="reg-password">Contraseña</label>
              <div className="inputWrapper">
                <FiLock className="inputIcon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="reg-password"
                  name="password"
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={handleRegisterChange}
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

            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="nombre">Nombre</label>
                <div className="inputWrapper">
                  <FiUser className="inputIcon" />
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Nombre"
                    value={registerData.nombre}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>

              <div className="formGroup">
                <label htmlFor="apellido">Apellido</label>
                <div className="inputWrapper">
                  <FiUser className="inputIcon" />
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    placeholder="Apellido"
                    value={registerData.apellido}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="telefono">Teléfono</label>
                <div className="inputWrapper">
                  <FiPhone className="inputIcon" />
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    placeholder="987654321"
                    value={registerData.telefono}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>

              <div className="formGroup">
                <label htmlFor="distrito">Distrito</label>
                <div className="inputWrapper">
                  <FiMapPin className="inputIcon" />
                  <input
                    type="text"
                    id="distrito"
                    name="distrito"
                    placeholder="Ej. Miraflores"
                    value={registerData.distrito}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="formGroup">
              <label htmlFor="direccion">Dirección</label>
              <div className="inputWrapper">
                <FiMapPin className="inputIcon" />
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  placeholder="Av. Principal 123"
                  value={registerData.direccion}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submitBtn" disabled={loading}>
              {loading ? "Procesando..." : "Crear Cuenta"}
            </button>
          </form>
        )}

        <div className="authLinks">
          {isLogin ? (
            <p>
              ¿No tienes cuenta?{" "}
              <button 
                type="button" 
                className="linkBtn" 
                onClick={() => { setIsLogin(false); setErrorMsg(""); }}
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{" "}
              <button 
                type="button" 
                className="linkBtn" 
                onClick={() => { setIsLogin(true); setErrorMsg(""); }}
              >
                Inicia sesión aquí
              </button>
            </p>
          )}
        </div>

        <div className="divider">
          <span>o</span>
        </div>

        <div className="socialAuth">
          <button type="button" className="btnSocial">
            <FcGoogle /> <span>Google</span>
          </button>
          <button type="button" className="btnSocial">
            <FaApple /> <span>Apple</span>
          </button>
          <button type="button" className="btnSocial btnFacebook">
            <FaFacebook /> <span>Facebook</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;