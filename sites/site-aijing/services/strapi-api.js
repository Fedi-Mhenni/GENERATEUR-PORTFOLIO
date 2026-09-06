import config from "../config.js";

async function request(endpoint) {
  const response = await fetch(`${config.API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Strapi a répondu avec le statut ${response.status}.`);
  }

  return response.json();
}

async function get(endpoint) {
  const json = await request(endpoint);
  return json.data;
}

export function getProfil() {
  return get("/profil?populate=photo,cv");
}

export function getProjets() {
  return get("/projets?populate=image");
}

export function getProjetsPage({ page = 1, pageSize = 6 } = {}) {
  const params = new URLSearchParams({
    populate: "image",
    "pagination[page]": String(page),
    "pagination[pageSize]": String(pageSize),
  });

  return request(`/projets?${params}`);
}

export function getExperiences() {
  return get("/experiences");
}

export function getCompetences() {
  return get("/competences");
}

export function getJourneys() {
  return get("/journeys");
}
