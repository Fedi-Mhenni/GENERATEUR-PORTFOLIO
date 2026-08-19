import { getProjets } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import Carte from "../vanilla-engine/src/components/carte.js";

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
          ? projets.map((projet) =>
              Carte({
                titre: projet.attributes?.titre ?? projet.titre,
                image: projet.image?.url ?? "",
                description: projet.description,
                lien: `/projets/${projet.slug}`,
              }),
            )
          : [{ type: "li", children: ["Aucun projet trouvé"] }],
      },
    ],
  };
}