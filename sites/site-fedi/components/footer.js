import BrowserLink from "../vanilla-engine/src/router/link.js";

export default function Footer() {
  return {
    type: "footer",
    children: [
      { type: "span", children: ["FM"] },
      BrowserLink("/", "Home"),
      BrowserLink("/a-propos", "À propos"),
      BrowserLink("/projets", "Projets"),
      BrowserLink("/contact", "Contact"),
    ],
  };
}
