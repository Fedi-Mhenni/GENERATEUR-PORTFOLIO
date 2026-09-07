import { getProjetBySlug } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import config from "../config.js";
import Navbar from "../components/navbar.js";
import Footer from "../components/footer.js";
import ExportPdfButton from "../components/export-pdf-button.js";

// Lien externe (GitHub) : même raison qu'ailleurs (home-page.js, about-page.js)
// — pushState refuse une URL cross-origin.
function externalLink(url, label, classNames) {
  return {
    type: "a",
    attributes: [
      ["href", url],
      ["target", "_blank"],
      ["rel", "noopener noreferrer"],
      ["class", classNames],
    ],
    children: [label],
  };
}

// Même structure que profil.introduction (home-page.js) : double retour à la
// ligne entre chaque paragraphe, vérifié via l'API réelle sur les 3 projets.
function splitParagraphs(text) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((paragraphe) => paragraphe.trim())
    .filter(Boolean);
}

export default async function ProjetDetailPage(params) {
  const projetData = await getProjetBySlug(params.slug);
  // Cohérence avec le fallback déjà utilisé dans projets-page.js
  // (projet.attributes?.titre ?? projet.titre) — Strapi 5 renvoie déjà le
  // format à plat, normalisé une seule fois ici par simple cohérence de style.
  const projet = projetData?.attributes ?? projetData;
  const footer = await Footer();

  // "technos" est une chaîne "Python,FastAPI,..." en base (pas une relation
  // Strapi) — vérifié réel sur les 3 projets, découpée ici en tags.
  const technos = (projet?.technos ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    type: "div",
    attributes: [["class", ["page"]]],
    children: [
      Navbar(),
      ExportPdfButton(),
      {
        type: "main",
        attributes: [["class", ["container", "projet-detail", "page__content"]]],
        children: [
          (() => {
            const lien = BrowserLink("/projets", "Back to projects ←");
            lien.attributes.push(["class", ["projet-detail__back"]]);
            return lien;
          })(),
          projet
            ? {
                type: "div",
                attributes: [["class", ["projet-detail__body"]]],
                children: [
                  { type: "h2", attributes: [["class", ["projet-detail__titre"]]], children: [projet.titre ?? ""] },
                  ...(technos.length > 0
                    ? [
                        {
                          type: "div",
                          attributes: [["class", ["projet-detail__tags"]]],
                          children: technos.map((techno) => ({
                            type: "span",
                            attributes: [["class", ["projet-detail__tag"]]],
                            children: [techno],
                          })),
                        },
                      ]
                    : []),
                  {
                    type: "div",
                    attributes: [["class", ["projet-detail__media"]]],
                    children: projet.image?.url
                      ? [
                          {
                            type: "img",
                            attributes: [
                              ["src", resolveImageUrl(projet.image.url, config.STRAPI_ORIGIN)],
                              ["alt", projet.titre ?? ""],
                            ],
                          },
                        ]
                      : [
                          {
                            type: "p",
                            attributes: [["class", ["projet-detail__media-placeholder"]]],
                            children: ["Project image — to add later"],
                          },
                        ],
                  },
                  {
                    type: "div",
                    attributes: [["class", ["projet-detail__context"]]],
                    children: [
                      { type: "p", attributes: [["class", ["projet-detail__context-title"]]], children: ["Context"] },
                      ...splitParagraphs(projet.description).map((paragraphe) => ({
                        type: "p",
                        attributes: [["class", ["projet-detail__paragraphe"]]],
                        children: [paragraphe],
                      })),
                    ],
                  },
                  ...(projet.lienGithub
                    ? [
                        externalLink(projet.lienGithub, "View on GitHub", [
                          "btn",
                          "btn--primary",
                          "btn--large",
                        ]),
                      ]
                    : []),
                ],
              }
            : { type: "p", attributes: [["class", ["projet-detail__empty"]]], children: ["Projet introuvable"] },
        ],
      },
      footer,
    ],
  };
}
