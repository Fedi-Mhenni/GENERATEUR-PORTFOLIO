import config from "../config.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import { getTranslations } from "../i18n/index.js";

function nonEmptyString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function preferredImage(image) {
  return image?.formats?.large ?? image ?? null;
}

function galleryImages(images, title, locale) {
  return (Array.isArray(images) ? images : []).flatMap((source, index) => {
    const image = preferredImage(source);
    const url = resolveImageUrl(image?.url, config.API_ORIGIN);

    if (!url) {
      return [];
    }

    return [{
      url,
      alt: nonEmptyString(source?.alternativeText) || `${title} — ${locale === "fr" ? "vue" : "view"} ${index + 1}`,
      width: image?.width || 0,
      height: image?.height || 0,
    }];
  });
}

function formatProjectDate(date, locale) {
  const value = nonEmptyString(date);

  if (!value) {
    return "";
  }

  const parsedDate = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
}

export default function adaptProjectToDetail(project, locale = "en") {
  const copy = getTranslations(locale).project;
  const normalizedProject = project?.attributes ?? project ?? {};
  const image = preferredImage(normalizedProject.image);
  const title = nonEmptyString(normalizedProject.titre) || "Untitled project";
  const date = formatProjectDate(normalizedProject.date, locale);
  const narratives = [
    {
      label: copy.contextLabel,
      title: copy.contextTitle,
      copy: nonEmptyString(normalizedProject.context),
    },
    {
      label: copy.processLabel,
      title: copy.processTitle,
      copy: nonEmptyString(normalizedProject.process),
    },
    {
      label: copy.solutionLabel,
      title: copy.solutionTitle,
      copy: nonEmptyString(normalizedProject.solution),
    },
  ].filter((section) => section.copy);

  return {
    title,
    slug: nonEmptyString(normalizedProject.slug),
    category: nonEmptyString(normalizedProject.soustitre),
    description: nonEmptyString(normalizedProject.description),
    technologies: nonEmptyString(normalizedProject.technos),
    date,
    githubUrl: nonEmptyString(normalizedProject.lienGithub),
    imageUrl: resolveImageUrl(image?.url, config.API_ORIGIN),
    imageAlt: nonEmptyString(normalizedProject.image?.alternativeText) || title,
    imageWidth: image?.width,
    imageHeight: image?.height,
    galleryImages: galleryImages(normalizedProject.optional_images, title, locale),
    narratives,
  };
}
