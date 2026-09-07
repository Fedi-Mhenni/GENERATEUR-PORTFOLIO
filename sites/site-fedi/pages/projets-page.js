import { getProjets } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import config from "../config.js";
import Navbar from "../components/navbar.js";
import Footer from "../components/footer.js";
import ExportPdfButton from "../components/export-pdf-button.js";

// Maquette Figma (node 223:654) : chaque projet est une rangée à 2 colonnes
// (mockup laptop | carte titre+soustitre+bouton — soustitre est la courte
// accroche affichée ici, pas la longue description), pas la carte empilée
// verticale de Carte() (packages/vanilla-engine) — Carte reste un composant
// générique inchangé pour d'éventuels autres usages ; cette mise en page est
// propre à cette page, construite directement ici (même logique que
// Home/About). BrowserLink() ne prend pas de classe, on complète après coup.
function cta(url, label, classNames) {
  const link = BrowserLink(url, label);
  link.attributes.push(["class", classNames]);
  return link;
}

// Le "cadre" est le vrai PNG exporté depuis Figma (assets/laptop-mockup.png),
// jamais redessiné en CSS — la capture du projet est positionnée dans le
// trou transparent de l'écran (mesuré précisément sur l'image : 12.83% /
// 4.29% / 74.34% / 64.69%, cf. commentaire dans projets.scss).
function laptopMockup(imageUrl, titre) {
  return {
    type: "div",
    attributes: [["class", ["carte-projet__laptop"]]],
    children: [
      imageUrl
        ? {
            type: "img",
            attributes: [
              ["class", ["carte-projet__laptop-screenshot"]],
              ["src", imageUrl],
              ["alt", titre],
            ],
          }
        : {
            type: "p",
            attributes: [["class", ["carte-projet__laptop-placeholder"]]],
            children: ["Project preview"],
          },
      {
        type: "img",
        attributes: [
          ["class", ["carte-projet__laptop-frame"]],
          // Chemin absolu depuis la racine du site : un chemin relatif se
          // résoudrait par rapport à l'URL courante (ex: /projets), pas au
          // fichier — casserait selon la route SPA active.
          ["src", "/assets/laptop-mockup.png"],
          ["alt", ""],
          ["aria-hidden", "true"],
        ],
      },
    ],
  };
}

export default async function ProjetsPage() {
  const projets = await getProjets();
  const footer = await Footer();

  return {
    type: "div",
    attributes: [["class", ["page"]]],
    children: [
      Navbar(),
      ExportPdfButton(),
      {
        type: "main",
        attributes: [["class", ["container", "projets", "page__content"]]],
        children: [
          { type: "h1", attributes: [["class", ["projets__title"]]], children: ["Projects"] },
          {
            type: "div",
            attributes: [["class", ["projets__liste"]]],
            children:
              projets.length > 0
                ? projets.map((projet) => {
                    const titre = projet.attributes?.titre ?? projet.titre;
                    return {
                      type: "div",
                      attributes: [["class", ["projet-ligne"]]],
                      children: [
                        laptopMockup(
                          resolveImageUrl(projet.image?.url, config.STRAPI_ORIGIN),
                          titre,
                        ),
                        {
                          type: "div",
                          attributes: [["class", ["projet-carte"]]],
                          children: [
                            { type: "h2", attributes: [["class", ["projet-carte__titre"]]], children: [titre] },
                            {
                              type: "p",
                              attributes: [["class", ["projet-carte__soustitre"]]],
                              children: [projet.soustitre ?? ""],
                            },
                            cta(`/projets/${projet.slug}`, "View project", [
                              "btn",
                              "btn--primary",
                              "btn--large",
                            ]),
                          ],
                        },
                      ],
                    };
                  })
                : [{ type: "p", attributes: [["class", ["projets__empty"]]], children: ["Aucun projet trouvé"] }],
          },
        ],
      },
      footer,
    ],
  };
}
