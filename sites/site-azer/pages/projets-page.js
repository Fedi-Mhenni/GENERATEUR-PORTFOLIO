import { getProjets } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";

export default async function ProjetsPage() {
  const projets = await getProjets();

  return {
    type: "div",
    children: [
      BrowserLink("/", "← Retour à l'accueil"),
      {
        type: "h1",
        children: ["Mes projets"],
      },
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
  };
}
