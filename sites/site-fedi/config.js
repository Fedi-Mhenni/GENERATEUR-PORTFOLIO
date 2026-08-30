const API_URL = "http://localhost:1337/api";

const config = {
  API_URL,
  // Origine Strapi seule (sans /api), pour préfixer les URLs relatives que
  // Strapi renvoie pour les médias (ex: image.url = "/uploads/xxx.png").
  STRAPI_ORIGIN: API_URL.replace(/\/api\/?$/, ""),
};

export default config;