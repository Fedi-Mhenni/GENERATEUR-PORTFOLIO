import { getProfil, getCompetences } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import config from "../config.js";

// Lien externe (média Strapi, réseau social, mailto) : navigation réelle du
// navigateur, contrairement à BrowserLink qui intercepte le clic pour le
// routeur SPA ne convient pas ici (pushState refuse une URL cross-origin).
function externalLink(url, label) {
  return {
    type: "a",
    attributes: [
      ["href", url],
      ["target", "_blank"],
      ["rel", "noopener noreferrer"],
    ],
    children: [label],
  };
}

export default async function AboutPage() {
  const profilData = await getProfil();
  // Cohérence avec le fallback déjà utilisé dans projets-page.js
  // (projet.attributes?.titre ?? projet.titre) — normalisé une seule fois
  // ici plutôt que répété par champ, Strapi 5 renvoie déjà le format à plat.
  const profil = profilData?.attributes ?? profilData;
  // "titre" a été remplacé par "nom"/"prenom" côté Strapi (profil.titre
  // n'existe plus). poste/ecole sont de nouveaux champs, affichés en
  // sous-titre — absents de la maquette précédente, seulement s'ils existent.
  const nomComplet = `${profil?.prenom ?? ""} ${profil?.nom ?? ""}`.trim();
  const posteEtEcole = [profil?.poste, profil?.ecole].filter(Boolean).join(", ");
  const competences = await getCompetences();

  return {
    type: "div",
    children: [
      BrowserLink("/", "← Retour à l'accueil"),
      {
        type: "h1",
        children: ["À propos"],
      },
      profil
        ? {
            type: "div",
            children: [
              { type: "h2", children: [nomComplet] },
              ...(posteEtEcole ? [{ type: "p", children: [posteEtEcole] }] : []),
              {
                type: "img",
                attributes: [
                  ["src", resolveImageUrl(profil.photo?.url, config.STRAPI_ORIGIN)],
                  ["alt", nomComplet],
                ],
              },
              { type: "p", children: [profil.introduction ?? ""] },
              { type: "p", children: [profil.biographie ?? ""] },
              ...(profil.cv
                ? [
                    externalLink(
                      resolveImageUrl(profil.cv.url, config.STRAPI_ORIGIN),
                      "Télécharger le CV",
                    ),
                  ]
                : []),
              ...(profil.linkedin ? [externalLink(profil.linkedin, "LinkedIn")] : []),
              ...(profil.github ? [externalLink(profil.github, "GitHub")] : []),
              ...(profil.email
                ? [externalLink(`mailto:${profil.email}`, profil.email)]
                : []),
            ],
          }
        : { type: "p", children: ["Profil non renseigné."] },
      {
        type: "h2",
        children: ["Compétences"],
      },
      {
        type: "ul",
        children: competences.length > 0
          ? competences.map((competence) => ({
              type: "li",
              children: [`${competence.nom} — ${competence.categorie}`],
            }))
          : [{ type: "li", children: ["Aucune compétence renseignée"] }],
      },
    ],
  };
}
