import { useState } from "react";
import { contactService } from "@/services/contact.service";
import "./ContactPage.scss";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "general",
    subject: "",
    message: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);
  const [claimData, setClaimData] = useState({
    fullName: "",
    docType: "DNI",
    docNumber: "",
    email: "",
    phone: "",
    claimType: "reclamo",
    detail: "",
  });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const data = await contactService.createContact(formData);

      setStatus({
        type: "success",
        message: `¡Mensaje recibido! Se registró en el panel de control con el Ticket #${data.ticketId || Math.floor(100000 + Math.random() * 900000)}`,
      });
      setFormData({ name: "", email: "", phone: "", category: "general", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "No se pudo conectar con el servidor. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setClaimLoading(true);
    setClaimStatus(null);

    try {
      const data = await contactService.createClaim(claimData);

      setClaimStatus(`Tu ${claimData.claimType} fue registrado exitosamente. Código de atención: ${data.claimCode || "REC-" + Math.floor(100000 + Math.random() * 900000)}`);
      setClaimData({ fullName: "", docType: "DNI", docNumber: "", email: "", phone: "", claimType: "reclamo", detail: "" });
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setClaimLoading(false);
    }
  };

  const faqs = [
    {
      cat: "order",
      q: "¿Cómo hago seguimiento a un pedido en curso?",
      a: "Puedes ver el mapa en tiempo real ingresando a la sección 'Mis Pedidos' en el menú principal."
    },
    {
      cat: "order",
      q: "¿Qué hago si mi pedido llegó incompleto o en mal estado?",
      a: "Selecciona el pedido afectado en tu historial y presiona 'Reportar un problema' para solicitar un reembolso o reposición inmediata."
    },
    {
      cat: "billing",
      q: "¿Cuáles son los métodos de pago aceptados?",
      a: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, Amex), billeteras digitales (Yape, Plin) y pago en efectivo."
    },
    {
      cat: "billing",
      q: "¿Cómo solicito mi comprobante electrónico o factura?",
      a: "Ingresa tus datos fiscales al realizar la compra o solicítala a través de nuestro formulario seleccionando la opción 'Facturación'."
    },
    {
      cat: "partner",
      q: "¿Cómo registrar mi comercio como restaurante aliado?",
      a: "Selecciona la opción 'Quiero ser Restaurante Aliado' en el formulario de contacto y te enviaremos la solicitud de afiliación."
    },
    {
      cat: "rider",
      q: "¿Cuáles son los requisitos para registrarme como repartidor?",
      a: "Necesitas ser mayor de edad, contar con documento de identidad vigente, vehículo propio (bici, moto o auto) y teléfono smartphone."
    }
  ];

  const handleQuickCardClick = (categoryKey) => {
    setActiveCategoryFilter(categoryKey);
    setFormData((prev) => ({ ...prev, category: categoryKey }));
  };

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch =
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === "all" || f.cat === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="contact-page-wrapper">
      <div className="contact-container">
        
        <header className="contact-main-header">
          <div className="status-badge">
            <span className="dot-green"></span> Centro de Atención Activo 24/7
          </div>
          <h1>¿En qué podemos ayudarte hoy?</h1>
          <p>Soporte en tiempo real para tus pedidos, pagos, cuenta y alianzas.</p>

          <div className="search-box">
            <input 
              type="text" 
              placeholder="🔍 Busca tu duda (ej: reembolso, factura, reparto...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="quick-actions-grid">
          <div 
            className={`quick-action-card ${activeCategoryFilter === "order" ? "active" : ""}`}
            onClick={() => handleQuickCardClick("order")}
          >
            <div className="quick-icon">📦</div>
            <div className="quick-info">
              <h4>Estado de Pedido</h4>
              <p>Rastrea tus entregas activas</p>
            </div>
          </div>

          <div 
            className={`quick-action-card ${activeCategoryFilter === "billing" ? "active" : ""}`}
            onClick={() => handleQuickCardClick("billing")}
          >
            <div className="quick-icon">💳</div>
            <div className="quick-info">
              <h4>Pagos y Reembolsos</h4>
              <p>Revisa cobros y devoluciones</p>
            </div>
          </div>

          <div 
            className={`quick-action-card ${activeCategoryFilter === "partner" ? "active" : ""}`}
            onClick={() => handleQuickCardClick("partner")}
          >
            <div className="quick-icon">🤝</div>
            <div className="quick-info">
              <h4>Aliados Comerciales</h4>
              <p>Registra tu negocio o marca</p>
            </div>
          </div>

          <div 
            className={`quick-action-card ${activeCategoryFilter === "rider" ? "active" : ""}`}
            onClick={() => handleQuickCardClick("rider")}
          >
            <div className="quick-icon">🛵</div>
            <div className="quick-info">
              <h4>Soy Repartidor</h4>
              <p>Soporte para la App Rider</p>
            </div>
          </div>
        </div>

        <div className="contact-grid-layout">
          <div className="card-box">
            <h2 className="card-title">📩 Déjanos un mensaje</h2>
            <p className="card-subtitle">Escríbenos directamente y la consulta se registrará en el panel administrativo.</p>

            {status.type === "success" && (
              <div className="status-alert success">✔️ {status.message}</div>
            )}
            {status.type === "error" && (
              <div className="status-alert error">⚠️ {status.message}</div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Tipo de Consulta</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="general">Consulta General</option>
                  <option value="order">Problema con un Pedido</option>
                  <option value="billing">Facturación y Cobros</option>
                  <option value="partner">Quiero ser Restaurante Aliado</option>
                  <option value="rider">Soporte para Repartidores</option>
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+51 987 654 321"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Asunto</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Resumen del motivo"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Detalle del Mensaje</label>
                <textarea
                  name="message"
                  required
                  placeholder="Describe detalladamente cómo podemos ayudarte..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? "Enviando al Panel..." : "Enviar Mensaje 🚀"}
              </button>
            </form>
          </div>

          <div className="card-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="card-title">❓ Preguntas Frecuentes</h2>
              {activeCategoryFilter !== "all" && (
                <button 
                  onClick={() => setActiveCategoryFilter("all")} 
                  style={{ background: "none", border: "none", color: "#ff441f", cursor: "pointer", fontSize: "0.8rem", fontWeight: "700" }}
                >
                  Ver todas
                </button>
              )}
            </div>
            <p className="card-subtitle">Respuestas inmediatas a tus dudas.</p>

            <div className="faq-list">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-question" onClick={() => toggleFaq(index)}>
                      <span>{faq.q}</span>
                      <span>{openFaq === index ? "▲" : "▼"}</span>
                    </div>
                    {openFaq === index && (
                      <div className="faq-answer">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No hay preguntas para el filtro o término seleccionado.</p>
              )}
            </div>

            <div className="contact-channels">
              <h3 style={{ fontSize: "1rem", margin: "0 0 0.5rem 0", color: "#0f172a" }}>Otros Canales Directos</h3>
              <div className="channel-list">
                <div className="channel-item">
                  <span>✉️</span> <strong>Soporte Email:</strong> soporte@protecrappi.com
                </div>
                <div className="channel-item">
                  <span>📞</span> <strong>Central Telefónica:</strong> (01) 800-72774
                </div>
                <div className="channel-item">
                  <span>⏰</span> <strong>Atención Web:</strong> Lunes a Domingo, 24/7
                </div>
              </div>
            </div>

            <div className="claim-book-banner">
              <div>
                <h5>📖 Libro de Reclamaciones</h5>
                <p>Conforme al Código de Protección al Consumidor.</p>
              </div>
              <button className="claim-btn" onClick={() => setShowClaimModal(true)}>
                Ingresar Reclamo
              </button>
            </div>
          </div>
        </div>
      </div>

      {showClaimModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => { setShowClaimModal(false); setClaimStatus(null); }}>✕</button>
            
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem 0", color: "#0f172a" }}>📖 Hoja de Reclamación Virtual</h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" }}>
              Registra tu reclamo o queja formal según la normativa vigente.
            </p>
            {claimStatus ? (
              <div className="status-alert success">
                ✔️ {claimStatus}
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="contact-form">
                <div className="form-group">
                  <label>Tipo de Atención</label>
                  <select 
                    value={claimData.claimType} 
                    onChange={(e) => setClaimData({...claimData, claimType: e.target.value})}
                  >
                    <option value="reclamo">Reclamo (Disconformidad con un producto/servicio)</option>
                    <option value="queja">Queja (Malestar por la atención brindada)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Tu nombre completo"
                    value={claimData.fullName}
                    onChange={(e) => setClaimData({...claimData, fullName: e.target.value})}
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="correo@ejemplo.com"
                      value={claimData.email}
                      onChange={(e) => setClaimData({...claimData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input 
                      type="tel" 
                      required 
                      placeholder="987654321"
                      value={claimData.phone}
                      onChange={(e) => setClaimData({...claimData, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Tipo de Doc.</label>
                    <select 
                      value={claimData.docType} 
                      onChange={(e) => setClaimData({...claimData, docType: e.target.value})}
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">Carné Extranjería</option>
                      <option value="RUC">RUC</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>N° Documento</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="12345678"
                      value={claimData.docNumber}
                      onChange={(e) => setClaimData({...claimData, docNumber: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Detalle del Reclamo / Queja</label>
                  <textarea 
                    required 
                    placeholder="Describe los hechos..."
                    value={claimData.detail}
                    onChange={(e) => setClaimData({...claimData, detail: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" disabled={claimLoading} className="btn-submit">
                  {claimLoading ? "Registrando..." : "Registrar Hoja de Reclamación"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactPage;