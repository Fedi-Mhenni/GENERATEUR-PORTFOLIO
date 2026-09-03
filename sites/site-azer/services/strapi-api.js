import config from "../config.js";

// Centralise la gestion des échecs réels (réponse HTTP en erreur, réseau
// injoignable, JSON invalide) : retourne null dans tous ces cas, jamais une
// exception. Le cas "pas de données" (ex: Strapi répond proprement avec
// data: null) n'est pas concerné ici, chaque fonction le gère elle-même via
// son propre "?? repli" juste en dessous.
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
