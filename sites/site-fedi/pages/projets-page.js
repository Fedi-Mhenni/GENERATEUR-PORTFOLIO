import { getProjets } from "../services/strapi-api.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import Carte from "../vanilla-engine/src/components/carte.js";
import config from "../config.js";

function resolveImageUrl(url) {
  if (!url) {
    return "";
  }
  // Strapi renvoie une URL relative pour les médias hébergés localement
  // (ex: "/uploads/xxx.png") : il faut la préfixer avec l'origine Strapi,
  // sinon elle se résout par rapport à l'origine du site qui l'affiche.
  // Si Strapi renvoie déjà une URL absolue (CDN externe, Lot 3), on ne
  // touche à rien pour éviter un double préfixage.
  return url.startsWith("/") ? `${config.STRAPI_ORIGIN}${url}` : url;
}

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
                image: resolveImageUrl(projet.image?.url),
                description: projet.description,
                lien: `/projets/${projet.slug}`,
              }),
            )
          : [{ type: "li", children: ["Aucun projet trouvé"] }],
      },
    ],
  };
}