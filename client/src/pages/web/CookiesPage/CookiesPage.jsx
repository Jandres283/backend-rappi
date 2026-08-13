import "./CookiesPage.scss";

export const CookiesPage = () => {
  return (
    <div className="cookies-page-wrapper">
      <div className="cookies-container">
        {/* HERO BANNER */}
        <header className="page-header">
          <div className="title-area">
            <h1>Política de Cookies</h1>
            <p>
              Ecosistema Rappi (Cliente, Restaurante, Driver y Admin)
              <span className="count-badge">Última actualización: 2026</span>
            </p>
          </div>
        </header>

        {/* GRILLA DE SECCIONES LEGALES */}
        <div className="cookies-grid">
          {/* SECCIÓN 1 - CORREGIDA CON LISTA DE PUNTOS */}
          <section className="cookies-card">
            <div className="card-header">
              <span className="icon">🍪</span>
              <h2>1. Uso de Cookies en Rappi</h2>
            </div>
            <p>
              En la plataforma de gestión de pedidos Rappi utilizamos cookies y tecnologías similares para garantizar el correcto funcionamiento del sistema en todos nuestros paneles e interfaces:
            </p>
            <ul>
              <li>
                <strong>Rendimiento:</strong> Optimizan la carga de imágenes de platos, menús y tiempo de respuesta en la web.
              </li>
              <li>
                <strong>Seguridad:</strong> Protegen las transacciones de pago y previenen accesos no autorizados a la plataforma.
              </li>
              <li>
                <strong>Navegación:</strong> Guardan tus preferencias de interfaz, ubicación y filtros aplicados durante tu sesión.
              </li>
            </ul>
          </section>

          {/* SECCIÓN 2 */}
          <section className="cookies-card">
            <div className="card-header">
              <span className="icon">👥</span>
              <h2>2. Cookies según el Rol de Usuario</h2>
            </div>
            <p>
              Dependiendo del perfil con el que te autentiques en la plataforma, procesamos la información de la siguiente manera:
            </p>
            <ul>
              <li>
                <strong>Clientes:</strong> Mantienen activa la sesión, guardan el historial del carrito de compras y recuerdan direcciones de entrega habituales.
              </li>
              <li>
                <strong>Restaurantes:</strong> Permiten la recepción de notificaciones de nuevos pedidos en tiempo real y la gestión del catálogo de platos activo.
              </li>
              <li>
                <strong>Drivers / Repartidores:</strong> Guardan el estado de disponibilidad en línea y rastrean la asignación del pedido para la ruta de entrega.
              </li>
              <li>
                <strong>Administradores:</strong> Garantizan el acceso seguro al panel de control, métricas de la plataforma y permisos de usuario.
              </li>
            </ul>
          </section>

          {/* SECCIÓN 3 */}
          <section className="cookies-card">
            <div className="card-header">
              <span className="icon">🔒</span>
              <h2>3. Cookies Técnicas y de Sesión</h2>
            </div>
            <p>
              Utilizamos cookies estrictamente necesarias para la autenticación mediante tokens seguros (JWT). Estas cookies permiten que no tengas que iniciar sesión constantemente mientras navegas entre las pantallas del sistema.
            </p>
          </section>

          {/* SECCIÓN 4 */}
          <section className="cookies-card">
            <div className="card-header">
              <span className="icon">⚙️</span>
              <h2>4. Control de Cookies</h2>
            </div>
            <p>
              Puedes deshabilitar o borrar las cookies desde los ajustes de tu navegador. Toma en cuenta que desactivar las cookies esenciales podría impedir la realización de pedidos o el acceso a las funciones de gestión del restaurante o driver.
            </p>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="cookies-footer">
          <p>
            ¿Tienes dudas sobre los términos o políticas de Rappi? Escríbenos a <strong>soporte@rappi.com</strong>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CookiesPage;