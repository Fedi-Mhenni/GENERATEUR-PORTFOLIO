import BrowserLink from "../vanilla-engine/src/router/link.js";

export default () => ({
  type: "div",
  children: [
    {
      type: "h1",
      children: ["Bienvenue sur mon portfolio"],
    },
    BrowserLink("/projets", "Voir mes projets"),
  ],
});