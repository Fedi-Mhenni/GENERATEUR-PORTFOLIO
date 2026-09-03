import resolveImageUrl from "./resolve-url.js";

// Strapi renvoie profil.cv = null tant qu'aucun fichier n'a été uploadé
// dans l'admin, et profil lui-même peut être absent (échec réseau sur
// getProfil()) : jamais d'exception, null dans les deux cas plutôt qu'un
// bouton de téléchargement cassé.
export default function getCvUrl(profil, origin) {
  const cvUrl = profil?.cv?.url;
  if (!cvUrl) {
    return null;
  }

  return resolveImageUrl(cvUrl, origin);
}
