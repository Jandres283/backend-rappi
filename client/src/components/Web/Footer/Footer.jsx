import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiPhone, FiMail } from "react-icons/fi";
import "./Footer.scss";

export const Footer = () => {
  return (
    <footer className="web-footer">
      <div className="footer-container">
        
        {/* Columna 1: Marca e Info */}
        <div className="footer-col brand-col">
          <h4>FoodApp</h4>
          <p>Tu plataforma de delivery favorita. Llevamos la mejor comida hasta la puerta de tu hogar.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FiFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FiInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <FiTwitter />
            </a>
          </div>
        </div>

        {/* Columna 2: Navegación */}
        <div className="footer-col">
          <h4>Navegación</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/restaurants">Restaurantes</Link></li>
            <li><Link to="/dishes">Platillos</Link></li>
            <li><Link to="/restaurant/login">Suma tu Restaurante</Link></li>
          </ul>
        </div>

        {/* Columna 3: Soporte */}
        <div className="footer-col">
          <h4>Soporte & Legales</h4>
          <ul>
            <li><Link to="/contact">Contacto y Ayuda</Link></li>
            <li><Link to="/terms">Términos y Condiciones</Link></li>
            <li><Link to="/privacy">Política de Privacidad</Link></li>
            <li><Link to="/cookies">Política de Cookies</Link></li> {/* 👈 LÍNEA AGREGADA */}
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div className="footer-col contact-col">
          <h4>Contacto</h4>
          <p><FiPhone /> +51 987 654 321</p>
          <p><FiMail /> soporte@rappi.com</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Rappi. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;