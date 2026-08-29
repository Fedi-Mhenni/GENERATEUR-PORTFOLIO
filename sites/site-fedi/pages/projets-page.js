import { getProjets } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import Carte from "../vanilla-engine/src/components/carte.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import config from "../config.js";

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
        // Carte() retourne un "div" (carte-projet) — un wrapper "ul" serait
        // du HTML invalide (un <ul> ne doit contenir que des <li>). Carte est
        // un composant de grille/carte, pas un item de liste : "div" est la
        // structure cohérente, pas <li><div>...</div></li>.
        type: "div",
        children: projets.length > 0
          ? projets.map((projet) =>
              Carte({
                titre: projet.attributes?.titre ?? projet.titre,
                soustitre: projet.soustitre,
                image: resolveImageUrl(projet.image?.url, config.STRAPI_ORIGIN),
                description: projet.description,
                lien: `/projets/${projet.slug}`,
              }),
            )
          : [{ type: "p", children: ["Aucun projet trouvé"] }],
      },
    ],
  };
}