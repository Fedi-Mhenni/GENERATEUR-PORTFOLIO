import Sidebar from "../components/sidebar.js";
import SkipLink from "../components/skip-link.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";

export default () => ({
  type: "div",
  attributes: [["class", ["page-layout"]]],
  children: [
    SkipLink(),
    Sidebar(null, ""),
    {
      type: "main",
      attributes: [["id", "main-content"], ["tabindex", "-1"]],
      children: [
        { type: "h1", children: ["Page 404"] },
        { type: "p", children: ["The page you're looking for doesn't exist."] },
        BrowserLink("/", "Retour à l'accueil"),
      ],
    },
  ],
});
