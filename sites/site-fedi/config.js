const API_URL = "https://api-portfolio-fedi.aijing.li/api";

const config = {
  API_URL,
  // Origine Strapi seule (sans /api), pour préfixer les URLs relatives que
  // Strapi renvoie pour les médias (ex: image.url = "/uploads/xxx.png").
  STRAPI_ORIGIN: API_URL.replace(/\/api\/?$/, ""),
  // À COMPLÉTER avec les identifiants EmailJS d'Azer (aucun trouvé dans le
  // repo — ne pas en inventer). Tant que ces valeurs sont vides, sendEmail()
  // échoue proprement (erreur API affichée dans le formulaire, pas de crash).
  EMAILJS: {
    serviceId: "",
    templateId: "",
    publicKey: "",
  },
};

export default config;
