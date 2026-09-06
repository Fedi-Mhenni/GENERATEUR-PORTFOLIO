import config from "../config.js";

async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

export async function getProfil() {
  const json = await fetchJson(
    `${config.API_URL}/profil?populate[0]=photo&populate[1]=cv`,
  );
  return json?.data ?? null;
}

export async function getProjets() {
  const json = await fetchJson(
    `${config.API_URL}/projets?populate=image&filters[statut][$eq]=publie`,
  );
  return json?.data ?? [];
}

export async function getProjetBySlug(slug) {
  const json = await fetchJson(
    `${config.API_URL}/projets?filters[slug][$eq]=${encodeURIComponent(slug)}&filters[statut][$eq]=publie&populate=image`,
  );
  return json?.data?.[0] ?? null;
}

export async function getCompetences() {
  const json = await fetchJson(`${config.API_URL}/competences`);
  return json?.data ?? [];
}
