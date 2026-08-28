import config from "../config.js";

export async function getProjets() {
  const response = await fetch(`${config.API_URL}/projets?populate=image`);
  const json = await response.json();
  return json.data;
}

export async function getProfil() {
  const response = await fetch(`${config.API_URL}/profil?populate=photo,cv`);
  const json = await response.json();
  return json.data;
}

export async function getCompetences() {
  const response = await fetch(`${config.API_URL}/competences`);
  const json = await response.json();
  return json.data;
}

export async function getProjetBySlug(slug) {
  const response = await fetch(
    `${config.API_URL}/projets?filters[slug][$eq]=${slug}&populate=image`,
  );
  const json = await response.json();
  return json.data[0] ?? null;
}