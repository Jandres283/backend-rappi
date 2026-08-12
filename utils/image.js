const fs = require("fs");
const path = require("path");

/**
 * Procesa el objeto de archivo subido por Multiparty/Multer
 * y devuelve la ruta relativa formateada para guardar en la base de datos.
 *
 * @param {Object} file - Objeto req.file de Multer
 * @returns {String|null} Ruta relativa normalizada (ej: "restaurant/foto.png") o null
 */
function getFilePath(file) {
  if (!file) return null;

  // Normaliza las barras invertidas de Windows (\) a barras normales (/)
  const filePath = file.path ? file.path.replace(/\\/g, "/") : "";

  if (!filePath) return null;

  const fileSplit = filePath.split("/");
  const fileName = fileSplit[fileSplit.length - 1];

  // Buscar si la ruta contiene una subcarpeta conocida de uploads
  const subfolders = ["avatars", "restaurant", "product", "news"];
  
  // Coincidencia flexible para rutas absolutas o relativas
  const folder =
    subfolders.find((f) => filePath.includes(`/${f}/`) || filePath.startsWith(`${f}/`)) ||
    fileSplit[fileSplit.length - 2];

  return `${folder}/${fileName}`;
}

/**
 * Elimina un archivo físico del disco si existe.
 *
 * @param {String} filePath - Ruta relativa o absoluta guardada en BD (ej: "restaurant/foto.png")
 */
function removeFile(filePath) {
  try {
    if (!filePath) return;

    // Remueve 'uploads/' si viniera incluido al inicio
    const cleanPath = filePath.replace(/^uploads[\/\\]/, "");

    // Resuelve la ruta absoluta hasta server/uploads/subcarpeta/archivo.ext
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, "..", "uploads", cleanPath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (error) {
    console.error("Error al eliminar el archivo físico:", error);
  }
}

module.exports = {
  getFilePath,
  removeFile,
};