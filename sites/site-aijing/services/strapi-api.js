import config from "../config.js";

async function get(endpoint) {
  const response = await fetch(`${config.API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Strapi a répondu avec le statut ${response.status}.`);
  }

  const json = await response.json();
  return json.data;
}

export function getProfil() {
  return get("/profil?populate=photo,cv");
}

export function getProjets() {
  return get("/projets?populate=image");
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
