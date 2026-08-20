export default function resolveImageUrl(url, origin) {
  if (!url) {
    return "";
  }
  // Strapi (et les CMS headless en général) renvoie une URL relative pour
  // les médias hébergés localement (ex: "/uploads/xxx.png") : il faut la
  // préfixer avec l'origine du CMS, sinon elle se résout par rapport à
  // l'origine du site qui l'affiche. Si l'URL est déjà absolue (CDN
  // externe), on ne touche à rien pour éviter un double préfixage.
  return url.startsWith("/") ? `${origin}${url}` : url;
}
