const API_URL = "http://localhost:1337/api";

const config = {
  API_URL,
  STRAPI_ORIGIN: API_URL.replace(/\/api\/?$/, ""),
};

export default config;
