import BrowserLink from "../vanilla-engine/src/router/link.js";

export default () => ({
  type: "div",
  children: [
    {
      type: "h1",
      children: ["Page 404"],
    },
    BrowserLink("/", "Retour à l'accueil"),
  ],
});
