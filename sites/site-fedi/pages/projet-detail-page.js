import { getProjetBySlug } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import config from "../config.js";

export default async function ProjetDetailPage(params) {
  const projet = await getProjetBySlug(params.slug);

  return {
    type: "div",
    children: [
      BrowserLink("/projets", "← Retour aux projets"),
      projet
        ? {
            type: "div",
            children: [
              { type: "h1", children: [projet.titre ?? ""] },
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
