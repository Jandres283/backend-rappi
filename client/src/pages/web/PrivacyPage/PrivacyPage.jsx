
import "./PrivacyPage.scss";

export const PrivacyPage = () => {
  return (
    <div className="privacy-page-wrapper">
      <div className="privacy-container">
        
        {/* HERO BANNER */}
        <header className="page-header">
          <div className="title-area">
            <h1>Política de Privacidad y Protección de Datos</h1>
            <p>
              Ecosistema Rappi (Restaurant, Driver y Usuario)
              <span className="count-badge">Agosto 2026</span>
            </p>
          </div>
        </header>

        {/* GRILLA DE SECCIONES LEGALES */}
        <div className="privacy-grid">
          
          {/* SECCIÓN 1 */}
          <section className="privacy-card">
            <div className="card-header">
              <span className="icon">🛡️</span>
              <h2>1. Información que Recopilamos</h2>
            </div>
            <p>
              Recopilamos la información personal necesaria para operar en la plataforma según el perfil de usuario:
            </p>
            <ul>
              <li><strong>Usuarios Finales:</strong> Nombre, correo, teléfono, dirección de entrega y métodos de pago.</li>
              <li><strong>Rappi Restaurant:</strong> Razón social, RUC/NIT, datos bancarios del comercio y dirección física del local.</li>
              <li><strong>Rappi Driver:</strong> Documento de identidad, licencia de conducir, antecedentes y ubicación GPS en tiempo real durante entregas.</li>
            </ul>
          </section>

          {/* SECCIÓN 2 */}
          <section className="privacy-card">
            <div className="card-header">
              <span className="icon">⚙️</span>
              <h2>2. Uso de la Información</h2>
            </div>
            <p>
              Utilizamos los datos recopilados para garantizar el funcionamiento eficiente de los servicios logísticos:
            </p>
            <ul>
              <li>Procesar y gestionar pedidos de forma ágil entre usuarios y Restaurantes Aliados.</li>
              <li>Asignar y optimizar rutas de entrega en tiempo real para los socios de Rappi Driver.</li>
              <li>Personalizar la experiencia comercial y enviar notificaciones operativas sobre el estado del pedido.</li>
            </ul>
          </section>

          {/* SECCIÓN 3 */}
          <section className="privacy-card">
            <div className="card-header">
              <span className="icon">🤝</span>
              <h2>3. Compartición de Datos con Terceros</h2>
            </div>
            <p>
              Los datos se comparten de forma limitada únicamente para fines operativos del servicio:
            </p>
            <ul>
              <li>El <strong>Restaurante Aliado</strong> recibe el detalle de la orden y el nombre del cliente para la preparación.</li>
              <li>El <strong>Rappi Driver</strong> accede a la dirección de entrega y nombre de contacto únicamente mientras la orden esté activa.</li>
              <li>Las pasarelas de pago integradas procesan las transacciones de manera cifrada.</li>
            </ul>
          </section>

          {/* SECCIÓN 4 */}
          <section className="privacy-card">
            <div className="card-header">
              <span className="icon">🔐</span>
              <h2>4. Seguridad y Retención de Datos</h2>
            </div>
            <p>
              Adoptamos estrictas medidas técnicas y organizativas para proteger la información contra accesos no autorizados, pérdidas o alteraciones.
            </p>
            <p>
              Los datos sensibles de pago se encriptan bajo estándares bancarios internacionales. Conservamos la información únicamente durante el tiempo requerido legal y operativamente.
            </p>
          </section>

          {/* SECCIÓN 5 */}
          <section className="privacy-card">
            <div className="card-header">
              <span className="icon">👤</span>
              <h2>5. Derechos del Titular (ARCO)</h2>
            </div>
            <p>
              Como usuario de la plataforma, tienes derecho a ejercer tus facultades de **Acceso, Rectificación, Cancelación y Oposición**:
            </p>
            <ul>
              <li>Solicitar la actualización o corrección de datos personales erróneos.</li>
              <li>Solicitar la eliminación de tu cuenta y datos cuando no existan obligaciones legales o contractuales pendientes.</li>
            </ul>
          </section>

          {/* SECCIÓN 6 */}
          <section className="privacy-card">
            <div className="card-header">
              <span className="icon">🍪</span>
              <h2>6. Rastreo y Tecnologías Similares</h2>
            </div>
            <p>
              Utilizamos cookies e identificadores de sesión para mantener la seguridad de la cuenta, recordar preferencias de navegación e identificar posibles fraudes en la plataforma.
            </p>
          </section>

        </div>

        {/* FOOTER */}
        <footer className="privacy-footer">
          <p>¿Dudas sobre el tratamiento de tus datos personales? Escríbenos a <strong>privacidad@rappi.com</strong></p>
        </footer>

      </div>
    </div>
  );
};

export default PrivacyPage;