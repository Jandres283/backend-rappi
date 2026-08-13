// src/components/Web/Contact/ContactForm.jsx
import { useState } from "react";
import "./ContactForm.scss";

const ContactForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="contact-form-container">
      <h3>Contáctanos</h3>
      <p>¿Tienes alguna consulta o problema con tu pedido? Escríbenos.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="contact-name">Nombre</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-email">Correo Electrónico</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-subject">Asunto</label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-message">Mensaje</label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-send-contact" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar Mensaje"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;