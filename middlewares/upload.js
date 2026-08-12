const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuración de almacenamiento dinámico
const storage = (folder = "common") =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.resolve(__dirname, `../uploads/${folder}`);

      // Crear carpeta recursivamente si no existe
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      // Sanitizar el nombre del campo para evitar caracteres extraños en el archivo
      const cleanFieldname = file.fieldname.replace(/[^a-zA-Z0-9]/g, "");
      
      cb(null, `${cleanFieldname}-${uniqueSuffix}${ext}`);
    },
  });

// Filtro para validar formatos de imágenes
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

  if (file.mimetype && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Formato de archivo no soportado. Solo se permiten imágenes (JPG, PNG, WEBP, GIF)."),
      false
    );
  }
};

// Middleware reutilizable por carpeta con límite de 5MB
const upload = (folder) =>
  multer({
    storage: storage(folder),
    fileFilter,
    limits: { 
      fileSize: 5 * 1024 * 1024 // Máximo 5 Megabytes
    },
  });

module.exports = upload;
