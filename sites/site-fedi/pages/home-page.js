import { getProfil } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import config from "../config.js";
import Navbar from "../components/navbar.js";
import Footer from "../components/footer.js";

// Lien externe (média Strapi) : navigation réelle du navigateur, contrairement
// à BrowserLink qui intercepte le clic pour le routeur SPA — ne convient pas
// ici (pushState refuse une URL cross-origin). Même pattern qu'about-page.js.
// classNames : tableau, convention du framework (cf. generate-structure.js).
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

// BrowserLink() ne prend pas de classe — on complète son attribut après coup
// plutôt que de toucher au framework. Même pattern que navbar.js/footer.js.
function ctaLink(url, label, classNames) {
  const link = BrowserLink(url, label);
  link.attributes.push(["class", classNames]);
  return link;
}

// profil.introduction est stocké en base avec des doubles retours à la ligne
// entre chaque bloc (vérifié via l'API réelle) — on découpe dessus, pas de
// séparateur explicite type "|" ou balisage à interpréter.
function introParagraphs(text) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((paragraphe) => paragraphe.trim())
    .filter(Boolean);
}

export default async function HomePage() {
  const profilData = await getProfil();
  // Même normalisation que about-page.js/projet-detail-page.js.
  const profil = profilData?.attributes ?? profilData;
  const nomComplet = `${profil?.prenom ?? ""} ${profil?.nom ?? ""}`.trim();
  const footer = await Footer();

  return {
    type: "div",
    // Wrapper "sticky footer" : #root n'a qu'un seul enfant (cette div), donc
    // c'est elle qui doit porter min-height:100vh + flex column, pas #root.
    attributes: [["class", ["page"]]],
    children: [
      Navbar(),
      profil
        ? {
            type: "section",
            attributes: [["class", ["hero"]]],
            children: [
              {
                type: "div",
                attributes: [["class", ["hero__media"]]],
                children: [
                  {
                    type: "img",
                    attributes: [
                      ["class", ["hero__photo"]],
                      ["src", resolveImageUrl(profil.photo?.url, config.STRAPI_ORIGIN)],
                      ["alt", nomComplet],
                    ],
                  },
                ],
              },
              {
                type: "div",
                attributes: [["class", ["hero__content"]]],
                children: [
                  ...(profil.disponibilite === true
                    ? [
                        {
                          type: "span",
                          attributes: [["class", ["hero__badge"]]],
                          children: ["Available for freelance"],
                        },
                      ]
                    : []),
                  {
                    type: "p",
                    attributes: [["class", ["hero__greeting"]]],
                    children: ["HI !, I'm"],
                  },
                  { type: "h1", attributes: [["class", ["hero__title"]]], children: [nomComplet] },
                  ...(profil.poste
                    ? [{ type: "p", attributes: [["class", ["hero__role"]]], children: [profil.poste] }]
                    : []),
                  ...(profil.ecole
                    ? [
                        {
                          type: "p",
                          attributes: [["class", ["hero__school"]]],
                          children: [`Student at ${profil.ecole}`],
                        },
                      ]
                    : []),
                  {
                    type: "div",
                    attributes: [["class", ["hero__intro-group"]]],
                    children: introParagraphs(profil.introduction).map((paragraphe) => ({
                      type: "p",
                      attributes: [["class", ["hero__intro"]]],
                      children: [paragraphe],
                    })),
                  },
                  {
                    type: "div",
                    attributes: [["class", ["hero__actions"]]],
                    children: [
                      ...(profil.cv
                        ? [
                            externalLink(
                              resolveImageUrl(profil.cv.url, config.STRAPI_ORIGIN),
                              "MY CV",
                              ["btn", "btn--secondary"],
                            ),
                          ]
                        : []),
                      ctaLink("/contact", "Get in touch", ["btn", "btn--primary"]),
                    ],
                  },
                ],
              },
            ],
          }
        : { type: "p", children: ["Profil non renseigné."] },
      footer,
    ],
  };
}
