import BrowserLink from "../vanilla-engine/src/router/link.js";

export default function Navbar() {
  return {
    type: "nav",
    children: [
      { type: "span", children: ["FM"] },
      BrowserLink("/", "Home"),
      BrowserLink("/a-propos", "À propos"),
      BrowserLink("/projets", "Projets"),
      BrowserLink("/contact", "Get in touch"),
    ],
  };
}
