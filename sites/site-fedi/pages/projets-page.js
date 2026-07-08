import { getProjets } from "../services/strapi-api.js";

export default async function ProjetsPage() {
  const projets = await getProjets();

  return {
    type: "h1",
    children: [projets.length > 0 ? projets[0].titre : "Aucun projet trouvé"],
  };
}