const API_URL = "http://localhost:1337/api";

// EmailJS (https://www.emailjs.com/) : créer un compte gratuit, un
// "Email Service" et un "Email Template", puis remplacer les 3 valeurs
// ci-dessous par celles du dashboard EmailJS (Service ID, Template ID,
// et la clé publique "Public Key" dans Account > General). Sans ces 3
// valeurs, le formulaire de contact ne peut pas envoyer d'email réel.
const EMAILJS_SERVICE_ID = "service_9okdwec";
const EMAILJS_TEMPLATE_ID = "template_ltl6k9g";
const EMAILJS_PUBLIC_KEY = "l6nalHoHf5Y3q3rPy";

const config = {
  API_URL,
  STRAPI_ORIGIN: API_URL.replace(/\/api\/?$/, ""),
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY,
};

export default config;
