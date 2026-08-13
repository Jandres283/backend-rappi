const Contact = require("../models/contact");

/**
 * Crear un nuevo mensaje de contacto (Público u Autenticado)
 */
async function createContact(req, res) {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contactData = {
      name,
      email,
      phone,
      subject,
      message,
    };

    // Si el usuario está autenticado, asociamos su ID
    if (req.user && req.user.user_id) {
      contactData.user = req.user.user_id;
    }

    const contact = new Contact(contactData);
    const contactStored = await contact.save();

    return res.status(201).send({
      msg: "Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.",
      contact: contactStored,
    });
  } catch (error) {
    console.error("Error en createContact:", error);
    return res.status(400).send({ msg: error.message || "Error al enviar el mensaje de contacto." });
  }
}

/**
 * Obtener lista de mensajes de contacto (Solo Admin)
 */
async function getContacts(req, res) {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filters = {};

    if (status) filters.status = status;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: { createdAt: -1 },
      populate: { path: "user", select: "firstname lastname email phone" },
    };

    const contacts = await Contact.paginate(filters, options);
    return res.status(200).send(contacts);
  } catch (error) {
    console.error("Error en getContacts:", error);
    return res.status(500).send({ msg: "Error al obtener los mensajes de contacto." });
  }
}

/**
 * Actualizar el estado de un mensaje de contacto (Solo Admin)
 */
async function updateContactStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const contactUpdated = await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!contactUpdated) {
      return res.status(404).send({ msg: "Mensaje de contacto no encontrado." });
    }

    return res.status(200).send(contactUpdated);
  } catch (error) {
    console.error("Error en updateContactStatus:", error);
    return res.status(400).send({ msg: error.message || "Error al actualizar el mensaje." });
  }
}

/**
 * Eliminar un mensaje de contacto (Solo Admin)
 */
async function deleteContact(req, res) {
  try {
    const { id } = req.params;
    const contactDeleted = await Contact.findByIdAndDelete(id);

    if (!contactDeleted) {
      return res.status(404).send({ msg: "Mensaje de contacto no encontrado." });
    }

    return res.status(200).send({ msg: "Mensaje de contacto eliminado correctamente." });
  } catch (error) {
    console.error("Error en deleteContact:", error);
    return res.status(500).send({ msg: "Error al eliminar el mensaje." });
  }
}

module.exports = {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact,
};