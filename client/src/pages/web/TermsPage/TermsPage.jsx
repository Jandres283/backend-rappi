
import "./TermsPage.scss";

export const TermsPage = () => {
  return (
    <div className="terms-page-wrapper">
      <div className="terms-container">
        
        {/* BANNER HERO */}
        <header className="page-header">
          <div className="title-area">
            <h1>Términos y Condiciones de Uso</h1>
            <p>
              Plataforma Integral Ecosistema Rappi (Restaurant, Driver y Usuario)
              <span className="count-badge">Agosto 2026</span>
            </p>
          </div>
        </header>

        {/* GRILLA DE CONTENIDO LEGAL */}
        <div className="terms-grid">
          
          {/* SECCIÓN 1 */}
          <section className="terms-card">
            <div className="card-header">
              <span className="icon">🤝</span>
              <h2>1. Naturaleza del Ecosistema Rappi</h2>
            </div>
            <p>
              <strong>Rappi</strong> opera como una plataforma de intermediación tecnológica que conecta a tres actores independientes:
            </p>
            <ul>
              <li><strong>Usuarios Finales:</strong> Clientes que solicitan productos mediante la plataforma.</li>
              <li><strong>Rappi Restaurant (Aliados):</strong> Comercios que ofrecen, preparan y empaquetan sus productos.</li>
              <li><strong>Rappi Driver (Repartidores):</strong> Socios repartidores independientes encargados de la logística y entrega.</li>
            </ul>
          </section>

          {/* SECCIÓN 2 */}
          <section className="terms-card">
            <div className="card-header">
              <span className="icon">🍽️</span>
              <h2>2. Términos para Rappi Restaurant (Aliados)</h2>
            </div>
            <p>
              Los Aliados Comerciales inscritos en el portal <strong>Rappi Restaurant</strong> se comprometen a:
            </p>
            <ul>
              <li>Mantener actualizada la disponibilidad de productos, precios y tiempos de preparación.</li>
              <li>Garantizar la calidad, empaque hermético e inocuidad de los alimentos entregados al repartidor.</li>
              <li>Asumir la responsabilidad exclusiva ante reclamos por ingredientes, alérgenos o insumos faltantes.</li>
            </ul>
          </section>

          {/* SECCIÓN 3 */}
          <section className="terms-card">
            <div className="card-header">
              <span className="icon">🛵</span>
              <h2>3. Términos para Rappi Driver (Repartidores)</h2>
            </div>
            <p>
              Los socios inscritos en <strong>Rappi Driver</strong> actúan como contratistas y mandatarios independientes:
            </p>
            <ul>
              <li>Son responsables del cuidado y transporte seguro de la orden durante el trayecto.</li>
              <li>Deben respetar los protocolos de entrega y la regla de 10 minutos de espera máxima en la ubicación del cliente.</li>
              <li>No existe relación de subordinación laboral directa con Rappi ni con los Restaurantes Aliados.</li>
            </ul>
          </section>

          {/* SECCIÓN 4 */}
          <section className="terms-card">
            <div className="card-header">
              <span className="icon">🛍️</span>
              <h2>4. Pedidos, Precios y Pagos</h2>
            </div>
            <p>
              Los precios exhibidos en la plataforma son fijados por los <strong>Restaurantes Aliados</strong>.
            </p>
            <ul>
              <li>Los costos de envío y tarifas de servicio se calculan automáticamente según la distancia, hora y demanda.</li>
              <li>Los pagos se procesan de forma segura a través de pasarelas de pago y billeteras integradas.</li>
            </ul>
          </section>

          {/* SECCIÓN 5 */}
          <section className="terms-card">
            <div className="card-header">
              <span className="icon">🚫</span>
              <h2>5. Cancelaciones, Reembolsos y Tiempos</h2>
            </div>
            <p>
              Las condiciones de cancelación se rigen según la fase del pedido:
            </p>
            <ul>
              <li><strong>Antes de preparación:</strong> Cancelación sin costo para el usuario.</li>
              <li><strong>En preparación o asignado a Driver:</strong> Si se cancela, se cobrará el valor del pedido y/o del envío para compensar al Restaurante y al Driver.</li>
              <li><strong>No respuesta del cliente:</strong> Si el usuario no atiende tras los 10 min de espera del Driver, la orden se marcará como no entregada sin reembolso.</li>
            </ul>
          </section>

          {/* SECCIÓN 6 */}
          <section className="terms-card">
            <div className="card-header">
              <span className="icon">⚖️</span>
              <h2>6. Deslindes de Responsabilidad</h2>
            </div>
            <p>
              <strong>Rappi no prepara alimentos ni presta servicios de transporte o flete directo.</strong>
            </p>
            <p>
              Rappi facilita la infraestructura digital para conectar a las partes. La responsabilidad del estado de la comida recae en el Restaurante Aliado, mientras que el transporte recae individualmente en el Rappi Driver.
            </p>
          </section>

        </div>

        {/* FOOTER */}
        <footer className="terms-footer">
          <p>¿Tienes dudas sobre los términos y condiciones? Escríbenos a <strong>soporte@rappi.com</strong></p>
        </footer>

      </div>
    </div>
  );
};

export default TermsPage;