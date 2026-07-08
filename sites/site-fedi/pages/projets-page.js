import { getProjets } from "../services/strapi-api.js";

export default async function ProjetsPage() {
  const projets = await getProjets();

  return {
    type: "div",
    children: [
      {
        type: "h1",
        children: ["Mes projets"],
      },
      {
        type: "ul",
        children: projets.length > 0
          ? projets.map((projet) => ({
              type: "li",
              children: [projet.titre],
            }))
          : [{ type: "li", children: ["Aucun projet trouvé"] }],
      },
    ],
  };
}