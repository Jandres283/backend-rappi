import { ENV } from "@/utils/constants"; // o ajusta según tu archivo de entorno

export const getImageUrl = (source) => {
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

  if (!source) return DEFAULT_IMAGE;

  let imagePath = source;

  // 1. Si es un objeto, busca exhaustivamente en cualquier propiedad conocida
  if (typeof source === "object") {
    imagePath =
      source.image ||
      source.avatar ||
      source.logo ||
      source.photo ||
      source.cover ||
      source.picture ||
      source.user?.avatar ||
      source.user?.image ||
      source.user?.photo;
  }

  if (!imagePath || typeof imagePath !== "string") return DEFAULT_IMAGE;

  // 2. Si ya es una URL absoluta, Blob o Base64
  if (/^(http|https|data:|blob:)/i.test(imagePath)) {
    return imagePath;
  }

  // 3. Limpiar barras invertidas de Windows (\ -> /)
  let cleanPath = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");

  // 4. Construir la URL completa apuntando al servidor backend
  const SERVER_HOST = (ENV?.SERVER_HOST || "http://localhost:3977").replace(/\/$/, "");

  if (cleanPath.startsWith("uploads/")) {
    return `${SERVER_HOST}/${cleanPath}`;
  }

  return `${SERVER_HOST}/uploads/${cleanPath}`;
};

export default getImageUrl;