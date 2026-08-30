import { getProfil } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import config from "../config.js";
import Navbar from "../components/navbar.js";
import Footer from "../components/footer.js";

// Lien externe (média Strapi) : navigation réelle du navigateur, contrairement
// à BrowserLink qui intercepte le clic pour le routeur SPA — ne convient pas
// ici (pushState refuse une URL cross-origin). Même pattern qu'about-page.js.
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

export default async function HomePage() {
  const profilData = await getProfil();
  // Même normalisation que about-page.js/projet-detail-page.js.
  const profil = profilData?.attributes ?? profilData;
  const nomComplet = `${profil?.prenom ?? ""} ${profil?.nom ?? ""}`.trim();

  return {
    type: "div",
    children: [
      Navbar(),
      profil
        ? {
            type: "section",
            children: [
              ...(profil.disponibilite === true
                ? [{ type: "span", children: ["Available for freelance"] }]
                : []),
              {
                type: "img",
                attributes: [
                  ["src", resolveImageUrl(profil.photo?.url, config.STRAPI_ORIGIN)],
                  ["alt", nomComplet],
                ],
              },
              { type: "h1", children: [nomComplet] },
              ...(profil.poste ? [{ type: "p", children: [profil.poste] }] : []),
              { type: "p", children: [profil.introduction ?? ""] },
              ...(profil.cv
                ? [
                    externalLink(
                      resolveImageUrl(profil.cv.url, config.STRAPI_ORIGIN),
                      "MY CV",
                    ),
                  ]
                : []),
              BrowserLink("/contact", "Get in touch"),
            ],
          }
        : { type: "p", children: ["Profil non renseigné."] },
      Footer(),
    ],
  };
}
