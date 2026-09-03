import Sidebar from "../components/sidebar.js";
import { getProfil, getProjets } from "../services/strapi-api.js";

export default async function ProjetsPage() {
  const [profil, projets] = await Promise.all([getProfil(), getProjets()]);

  return {
    type: "div",
    attributes: [["class", ["page-layout"]]],
    children: [
      Sidebar(profil, "/projects"),
      {
        type: "main",
        attributes: [["class", ["hero"]]],
        children: [
          { type: "h1", children: ["Mes projets"] },
          {
            type: "ul",
            children: projets.length > 0
              ? projets.map((projet) => ({
                  type: "li",
                  children: [projet.attributes?.titre ?? projet.titre],
                }))
              : [{ type: "li", children: ["Aucun projet trouvé"] }],
          },
        ],
      },
    ],
  };
}
