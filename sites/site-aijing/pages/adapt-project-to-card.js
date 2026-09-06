import config from "../config.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";

function nonEmptyString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function preferredImage(image) {
  if (!image) {
    return null;
  }

  return image.formats?.large ?? image;
}

export default function adaptProjectToCard(project) {
  const image = preferredImage(project?.image);
  const title = nonEmptyString(project?.titre) || "Untitled project";
  const slug = nonEmptyString(project?.slug);

  return {
    title,
    category: nonEmptyString(project?.soustitre),
    description: nonEmptyString(project?.description),
    technologies: nonEmptyString(project?.technos),
    imageUrl: resolveImageUrl(image?.url, config.API_ORIGIN),
    imageAlt: nonEmptyString(project?.image?.alternativeText) || title,
    imageWidth: image?.width,
    imageHeight: image?.height,
    href: slug ? `/projects/${slug}` : "",
  };
}
