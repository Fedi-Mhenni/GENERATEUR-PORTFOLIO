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

export function getLatestProjets() {
  const params = new URLSearchParams({
    populate: "image",
    "sort[0]": "date:desc",
    "pagination[page]": "1",
    "pagination[pageSize]": "3",
  });

  return get(`/projets?${params}`);
}

export async function getProjetBySlug(slug) {
  const params = new URLSearchParams({
    populate: "image",
    "filters[slug][$eq]": slug,
    "pagination[pageSize]": "1",
  });
  const projects = await get(`/projets?${params}`);

  if (!Array.isArray(projects) || projects.length === 0) {
    return null;
  }

  return projects[0];
}

export function getProjetsByDate() {
  const params = new URLSearchParams({
    "sort[0]": "date:desc",
    "pagination[page]": "1",
    "pagination[pageSize]": "100",
  });

  return get(`/projets?${params}`);
}

export function getProjetsPage({ page = 1, pageSize = 6 } = {}) {
  const params = new URLSearchParams({
    populate: "image",
    "sort[0]": "date:desc",
    "pagination[page]": String(page),
    "pagination[pageSize]": String(pageSize),
  });

  return request(`/projets?${params}`);
}

export function getExperiences() {
  const params = new URLSearchParams({
    "sort[0]": "dateDebut:desc",
    "pagination[page]": "1",
    "pagination[pageSize]": "100",
  });

  return get(`/experiences?${params}`);
}

export function getCompetences() {
  const params = new URLSearchParams({
    "sort[0]": "categorie:asc",
    "sort[1]": "nom:asc",
    "pagination[page]": "1",
    "pagination[pageSize]": "100",
  });

  return get(`/competences?${params}`);
}

export function getJourneys() {
  const params = new URLSearchParams({
    "sort[0]": "date_debut:desc",
    "pagination[page]": "1",
    "pagination[pageSize]": "100",
  });

  return get(`/journeys?${params}`);
}
