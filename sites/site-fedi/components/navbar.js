import BrowserLink from "../vanilla-engine/src/router/link.js";

function navLink(url, label, classNames) {
  const link = BrowserLink(url, label);
  link.attributes.push(["class", classNames]);
  return link;
}

export default function Navbar() {
  return {
    type: "nav",
    attributes: [["class", ["navbar"]]],
    // 2 enfants directs seulement (logo, groupe de droite) : conforme à Figma,
    // pas 3 zones à largeur égale.
    children: [
      { type: "span", attributes: [["class", ["navbar__logo"]]], children: ["FM"] },
      {
        type: "div",
        attributes: [["class", ["navbar__right"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["navbar__links"]]],
            children: [
              navLink("/", "Home", ["navbar__link"]),
              navLink("/a-propos", "About", ["navbar__link"]),
              navLink("/projets", "Projects", ["navbar__link"]),
            ],
          },
          navLink("/contact", "Get in touch", ["navbar__cta"]),
        ],
      },
    ],
  };
}
