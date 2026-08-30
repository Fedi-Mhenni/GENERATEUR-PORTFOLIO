import { getProjetBySlug } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import config from "../config.js";

export default async function ProjetDetailPage(params) {
  const projetData = await getProjetBySlug(params.slug);
  // Cohérence avec le fallback déjà utilisé dans projets-page.js
  // (projet.attributes?.titre ?? projet.titre) — Strapi 5 renvoie déjà le
  // format à plat, normalisé une seule fois ici par simple cohérence de style.
  const projet = projetData?.attributes ?? projetData;

  return {
    type: "div",
    children: [
      BrowserLink("/projets", "← Retour aux projets"),
      projet
        ? {
            type: "div",
            children: [
              { type: "h1", children: [projet.titre ?? ""] },
              ...(projet.soustitre
                ? [{ type: "p", children: [projet.soustitre] }]
                : []),
              {
                type: "img",
                attributes: [
                  ["src", resolveImageUrl(projet.image?.url, config.STRAPI_ORIGIN)],
                  ["alt", projet.titre ?? ""],
                ],
              },
              { type: "p", children: [projet.description ?? ""] },
              { type: "p", children: [`Date : ${projet.date ?? ""}`] },
            ],
          }
        : { type: "p", children: ["Projet introuvable"] },
    ],
  };
}
