import config from "../config.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import { getTranslations } from "../i18n/index.js";

function nonEmptyString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(record) {
  return record?.attributes ?? record ?? {};
}

function formatMonthYear(value, locale) {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function period(start, end, locale) {
  return {
    periodStart: formatMonthYear(start, locale),
    periodEnd: formatMonthYear(end, locale),
  };
}

function preferredImage(media) {
  return media?.formats?.large ?? media ?? null;
}

function firstImage(media) {
  const images = Array.isArray(media) ? media : [media];
  return preferredImage(images.find(Boolean));
}

function parcoursImage(media, fallbackAlt) {
  const image = firstImage(media);

  return {
    imageUrl: resolveImageUrl(image?.url, config.API_ORIGIN),
    imageAlt: nonEmptyString(image?.alternativeText) || fallbackAlt,
    imageWidth: image?.width || 0,
    imageHeight: image?.height || 0,
  };
}

function profileDetails(profile, locale) {
  if (!profile) {
    return null;
  }

  const value = normalize(profile);
  const firstName = nonEmptyString(value.prenom);
  const lastName = nonEmptyString(value.nom);
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const photo = value.photo ?? null;

  return {
    title: firstName
      ? (locale === "fr" ? `À propos de ${firstName}` : `About ${firstName}`)
      : getTranslations(locale).about.title,
    biography: nonEmptyString(value.biographie) || nonEmptyString(value.introduction),
    photoUrl: resolveImageUrl(photo?.url, config.API_ORIGIN),
    photoAlt: nonEmptyString(photo?.alternativeText) || `${locale === "fr" ? "Portrait de" : "Portrait of"} ${fullName || "Aijing Li"}`,
    photoWidth: photo?.width || 0,
    photoHeight: photo?.height || 0,
    cvUrl: resolveImageUrl(value.cv?.url, config.API_ORIGIN),
  };
}

function skillGroups(competencies, locale) {
  const groups = new Map();

  (Array.isArray(competencies) ? competencies : []).forEach((competency) => {
    const value = normalize(competency);
    const name = nonEmptyString(value.nom);

    if (!name) {
      return;
    }

    const category = nonEmptyString(value.categorie) || getTranslations(locale).about.skillsTitle;
    const entries = groups.get(category) ?? [];
    entries.push(name);
    groups.set(category, entries);
  });

  return [...groups].map(([title, items]) => ({ title, items: items.join(" · ") }));
}

function journeyEntries(journeys, locale) {
  return (Array.isArray(journeys) ? journeys : []).flatMap((journey, index) => {
    const value = normalize(journey);
    const title = nonEmptyString(value.cursus) || nonEmptyString(value.ecole);

    if (!title) {
      return [];
    }

    const location = [nonEmptyString(value.ville), nonEmptyString(value.pays)]
      .filter(Boolean)
      .join(", ");
    const school = nonEmptyString(value.cursus) ? nonEmptyString(value.ecole) : "";

    return [{
      ...period(value.date_debut, value.date_fin, locale),
      ...parcoursImage(value.image, `${locale === "fr" ? "Image de" : "Image for"} ${title}`),
      title,
      description: [school, location].filter(Boolean).join(" · "),
      mediaIndex: String(index + 1).padStart(2, "0"),
      mediaLabel: school || location,
      mediaPosition: "photo-left",
    }];
  });
}

function experienceEntries(experiences, locale) {
  return (Array.isArray(experiences) ? experiences : []).flatMap((experience, index) => {
    const value = normalize(experience);
    const title = nonEmptyString(value.intitule);

    if (!title) {
      return [];
    }

    const company = nonEmptyString(value.entreprise);
    const description = nonEmptyString(value.description);

    return [{
      ...period(value.dateDebut, value.dateFin, locale),
      ...parcoursImage(value.image, `${locale === "fr" ? "Image de" : "Image for"} ${title}`),
      title,
      company,
      description,
      mediaIndex: String(index + 1).padStart(2, "0"),
      mediaLabel: company,
      mediaPosition: "photo-right",
    }];
  });
}

export default function adaptAboutData({
  profile,
  competencies,
  journeys,
  experiences,
} = {}, locale = "en") {
  return {
    profile: profileDetails(profile, locale),
    skills: skillGroups(competencies, locale),
    journeys: journeyEntries(journeys, locale),
    experiences: experienceEntries(experiences, locale),
  };
}
