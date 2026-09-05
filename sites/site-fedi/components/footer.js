import { getProfil } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";

// BrowserLink() ne prend pas de classe — on complète son attribut après coup
// plutôt que de toucher au framework. classNames : tableau, convention du
// framework (cf. generate-structure.js).
function footerLink(url, label, classNames) {
  const link = BrowserLink(url, label);
  link.attributes.push(["class", classNames]);
  return link;
}

// Lien externe (GitHub/LinkedIn/mailto) : même raison qu'externalLink() de
// home-page.js, pushState refuse une URL cross-scheme/cross-origin.
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

// Footer se recharge son propre profil plutôt que de le recevoir en
// paramètre : reste autonome, réutilisable tel quel sur les 4 autres pages
// (tâche séparée) sans leur faire porter le fetch pour lui.
export default async function Footer() {
  const profilData = await getProfil();
  const profil = profilData?.attributes ?? profilData;
  const nomComplet = `${profil?.prenom ?? ""} ${profil?.nom ?? ""}`.trim();
  const annee = new Date().getFullYear();

  return {
    type: "footer",
    attributes: [["class", ["footer"]]],
    children: [
      {
        type: "div",
        attributes: [["class", ["footer__top"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["footer__brand"]]],
            children: [{ type: "span", attributes: [["class", ["footer__logo"]]], children: ["FM"] }],
          },
          {
            type: "div",
            attributes: [["class", ["footer__column"]]],
            children: [
              { type: "p", attributes: [["class", ["footer__column-title"]]], children: ["Quick Links"] },
              {
                type: "div",
                attributes: [["class", ["footer__links"]]],
                children: [
                  footerLink("/", "Home", ["footer__link"]),
                  footerLink("/a-propos", "About", ["footer__link"]),
                  footerLink("/projets", "Projects", ["footer__link"]),
                  footerLink("/contact", "Contact", ["footer__link"]),
                ],
              },
            ],
          },
          {
            type: "div",
            attributes: [["class", ["footer__column"]]],
            children: [
              { type: "p", attributes: [["class", ["footer__column-title"]]], children: ["Connect"] },
              {
                type: "div",
                attributes: [["class", ["footer__links"]]],
                children: [
                  ...(profil?.email
                    ? [externalLink(`mailto:${profil.email}`, profil.email, ["footer__link"])]
                    : []),
                  ...(profil?.github
                    ? [externalLink(profil.github, "GitHub", ["footer__link"])]
                    : []),
                  ...(profil?.linkedin
                    ? [externalLink(profil.linkedin, "LinkedIn", ["footer__link"])]
                    : []),
                ],
              },
            ],
          },
        ],
      },
      {
        type: "p",
        attributes: [["class", ["footer__quote"]]],
        children: ["First make it work, then make it smart, then make it beautiful."],
      },
      {
        type: "p",
        attributes: [["class", ["footer__copyright"]]],
        children: [`© ${annee} ${nomComplet || "Fedi Mhenni"}`],
      },
    ],
  };
}
