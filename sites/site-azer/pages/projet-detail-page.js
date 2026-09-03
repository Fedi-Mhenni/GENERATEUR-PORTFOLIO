import Sidebar from "../components/sidebar.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import { getProfil } from "../services/strapi-api.js";

export default async function ProjetDetailPage({ slug }) {
  const profil = await getProfil();

  return {
    type: "div",
    attributes: [["class", ["page-layout"]]],
    children: [
      Sidebar(profil, "/projects"),
      {
        type: "main",
        attributes: [["class", ["projects-page"]]],
        children: [
          { type: "h1", children: [`Projet : ${slug}`] },
          { type: "p", children: ["Page de détail en construction."] },
          BrowserLink("/projects", "Retour aux projets"),
        ],
      },
    ],
  };
}
