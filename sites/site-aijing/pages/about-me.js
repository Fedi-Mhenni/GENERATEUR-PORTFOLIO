import Parcours from "../components/parcours.js";
import SiteLayout from "../components/site-layout.js";
import SkillGroup from "../components/skill-group.js";
import {
  getCompetences,
  getExperiences,
  getJourneys,
  getProfil,
} from "../services/strapi-api.js";
import adaptAboutData from "./adapt-about-data.js";
import { getFooterContactPropsFromProfile } from "./get-footer-contact-props.js";
import { pathFor, t } from "../i18n/index.js";

const aboutStates = new Map();

function refreshAboutPage(locale) {
  if (window.location.pathname === pathFor(locale, "about")) {
    window.dispatchEvent(new Event("pushstate"));
  }
}

function resultValue(result) {
  return result.status === "fulfilled" ? result.value : null;
}

function loadAboutData(locale) {
  const existingState = aboutStates.get(locale);

  if (existingState) {
    return existingState;
  }

  const state = {
    status: "loading",
    records: null,
    profileRecord: null,
    failedSources: [],
  };
  aboutStates.set(locale, state);

  const sources = [
    ["profile", getProfil(locale)],
    ["skills", getCompetences()],
    ["education", getJourneys(locale)],
    ["experiences", getExperiences(locale)],
  ];

  Promise.allSettled(sources.map(([, request]) => request))
    .then((results) => {
      state.profileRecord = resultValue(results[0]);
      state.records = {
        profile: state.profileRecord,
        competencies: resultValue(results[1]),
        journeys: resultValue(results[2]),
        experiences: resultValue(results[3]),
      };
      state.failedSources = results.flatMap((result, index) =>
        result.status === "rejected" ? [sources[index][0]] : []
      );
      state.status = state.failedSources.length === sources.length
        ? "error"
        : "success";
    })
    .catch((error) => {
      console.error("Impossible de préparer la page About.", error);
      state.status = "error";
    })
    .finally(() => refreshAboutPage(locale));

  return state;
}

function pageStatus({ role, title, copy }) {
  return {
    type: "section",
    attributes: [
      ["class", ["about-page__status"]],
      ...(role ? [["role", role]] : []),
    ],
    children: [
      { type: "h1", attributes: [["class", ["type-heading-primary"]]], children: [title] },
      { type: "p", children: [copy] },
    ],
  };
}

function cvLink(href) {
  return {
    type: "a",
    attributes: [
      ["class", ["button", "about-page__cv-link"]],
      ["href", href],
      ["target", "_blank"],
      ["rel", "noopener"],
    ],
    children: [t("about.downloadCv")],
  };
}

function introduction(profile) {
  if (!profile) {
    return {
      type: "section",
      attributes: [["class", ["about-page__introduction", "about-page__introduction--without-portrait"]]],
      children: [
        {
          type: "div",
          attributes: [["class", ["about-page__biography"]]],
          children: [
            { type: "p", attributes: [["class", ["type-label", "about-page__eyebrow"]]], children: [t("about.eyebrow")] },
            { type: "h1", attributes: [["class", ["type-heading-primary"]]], children: [t("about.title")] },
            { type: "p", attributes: [["class", ["about-page__feedback"]]], children: [t("about.profileUnavailable")] },
          ],
        },
      ],
    };
  }

  const portrait = profile.photoUrl
    ? [{
        type: "img",
        attributes: [
          ["class", ["about-page__portrait"]],
          ["src", profile.photoUrl],
          ["alt", profile.photoAlt],
          ...(profile.photoWidth ? [["width", profile.photoWidth]] : []),
          ...(profile.photoHeight ? [["height", profile.photoHeight]] : []),
        ],
      }]
    : [];

  return {
    type: "section",
    attributes: [["class", ["about-page__introduction", ...(!portrait.length ? ["about-page__introduction--without-portrait"] : [])]]],
    children: [
      ...portrait,
      {
        type: "div",
        attributes: [["class", ["about-page__biography"]]],
        children: [
          { type: "p", attributes: [["class", ["type-label", "about-page__eyebrow"]]], children: [t("about.eyebrow")] },
          { type: "h1", attributes: [["class", ["type-heading-primary"]]], children: [profile.title] },
          ...(profile.biography
            ? [{ type: "p", attributes: [["class", ["about-page__biography-copy"]]], children: [profile.biography] }]
            : []),
          ...(profile.cvUrl ? [cvLink(profile.cvUrl)] : []),
        ],
      },
    ],
  };
}

function sectionHeading(label, title, alignEnd = false) {
  return {
    type: "header",
    attributes: [["class", ["about-page__section-heading", ...(alignEnd ? ["about-page__section-heading--end"] : [])]]],
    children: [
      { type: "p", attributes: [["class", ["type-label", "about-page__eyebrow"]]], children: [label] },
      ...(title ? [{ type: "h2", attributes: [["class", ["type-heading-primary"]]], children: [title] }] : []),
    ],
  };
}

function parcoursSection({ label, title, entries, className, alignEnd }) {
  if (!entries.length) {
    return null;
  }

  return {
    type: "section",
    attributes: [["class", ["about-page__parcours-section", className]]],
    children: [
      sectionHeading(label, title, alignEnd),
      {
        type: "ol",
        attributes: [["class", ["about-page__parcours-list"]]],
        children: entries.map((entry) => ({ type: "li", children: [Parcours(entry)] })),
      },
    ],
  };
}

function aboutContent(locale, state) {
  if (state.status === "loading") {
    return [pageStatus({
      role: "status",
      title: t("about.loadingTitle"),
      copy: t("about.loadingCopy"),
    })];
  }

  if (state.status === "error") {
    return [pageStatus({
      role: "alert",
      title: t("about.unavailableTitle"),
      copy: t("about.unavailableCopy"),
    })];
  }

  const { profile, skills, journeys, experiences } = adaptAboutData(
    state.records,
    locale,
  );
  const sections = [
    introduction(profile),
    ...(state.failedSources.length
      ? [{
          type: "p",
          attributes: [["class", ["about-page__partial-feedback"]], ["role", "status"]],
          children: [t("about.partialUnavailable")],
        }]
      : []),
  ];

  if (skills.length) {
    sections.push({
      type: "section",
      attributes: [["class", ["about-page__skills"]]],
      children: [
        sectionHeading(t("about.skillsLabel"), t("about.skillsTitle")),
        {
          type: "div",
          attributes: [["class", ["about-page__skill-groups"]]],
          children: skills.map((skill) => SkillGroup(skill)),
        },
      ],
    });
  }

  const education = parcoursSection({
    label: t("about.educationLabel"),
    title: "",
    entries: journeys,
    className: "about-page__education",
  });
  const experiencesSection = parcoursSection({
    label: t("about.experiencesLabel"),
    title: "",
    entries: experiences,
    className: "about-page__experiences",
    alignEnd: true,
  });

  return [...sections, ...[education, experiencesSection].filter(Boolean)];
}

export default function AboutMePage({ locale = "en" } = {}) {
  const aboutState = loadAboutData(locale);
  const footerProps = getFooterContactPropsFromProfile(aboutState.profileRecord, locale);

  return SiteLayout({
    currentPath: pathFor(locale, "about"),
    mainClassName: "about-page",
    footerProps,
    locale,
    mainChildren: [
      {
        type: "div",
        attributes: [["class", ["about-page__content"]]],
        children: aboutContent(locale, aboutState),
      },
    ],
  });
}
