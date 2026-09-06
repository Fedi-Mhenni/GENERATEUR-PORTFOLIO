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
import { footerContactCopy } from "./static-site-content.js";

const aboutState = {
  status: "loading",
  data: null,
  profileRecord: null,
  failedSources: [],
};

let aboutRequest;

function refreshAboutPage() {
  if (window.location.pathname === "/about-me") {
    window.dispatchEvent(new Event("pushstate"));
  }
}

function resultValue(result) {
  return result.status === "fulfilled" ? result.value : null;
}

function loadAboutData() {
  if (aboutRequest) {
    return;
  }

  const sources = [
    ["profile", getProfil()],
    ["skills", getCompetences()],
    ["education", getJourneys()],
    ["experiences", getExperiences()],
  ];

  aboutRequest = Promise.allSettled(sources.map(([, request]) => request))
    .then((results) => {
      aboutState.profileRecord = resultValue(results[0]);
      aboutState.data = adaptAboutData({
        profile: aboutState.profileRecord,
        competencies: resultValue(results[1]),
        journeys: resultValue(results[2]),
        experiences: resultValue(results[3]),
      });
      aboutState.failedSources = results.flatMap((result, index) =>
        result.status === "rejected" ? [sources[index][0]] : []
      );
      aboutState.status = aboutState.failedSources.length === sources.length
        ? "error"
        : "success";
    })
    .catch((error) => {
      console.error("Impossible de préparer la page About.", error);
      aboutState.status = "error";
    })
    .finally(refreshAboutPage);
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
    children: ["Download CV"],
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
            { type: "p", attributes: [["class", ["type-label", "about-page__eyebrow"]]], children: ["01 / ABOUT"] },
            { type: "h1", attributes: [["class", ["type-heading-primary"]]], children: ["About Me"] },
            { type: "p", attributes: [["class", ["about-page__feedback"]]], children: ["Profile information is temporarily unavailable."] },
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
          { type: "p", attributes: [["class", ["type-label", "about-page__eyebrow"]]], children: ["01 / ABOUT"] },
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

function aboutContent() {
  if (aboutState.status === "loading") {
    return [pageStatus({
      role: "status",
      title: "Loading About Me…",
      copy: "Profile, skills and experience are loading.",
    })];
  }

  if (aboutState.status === "error") {
    return [pageStatus({
      role: "alert",
      title: "About Me unavailable",
      copy: "The page is temporarily unavailable. Please try again later.",
    })];
  }

  const { profile, skills, journeys, experiences } = aboutState.data;
  const sections = [
    introduction(profile),
    ...(aboutState.failedSources.length
      ? [{
          type: "p",
          attributes: [["class", ["about-page__partial-feedback"]], ["role", "status"]],
          children: ["Some profile information is temporarily unavailable."],
        }]
      : []),
  ];

  if (skills.length) {
    sections.push({
      type: "section",
      attributes: [["class", ["about-page__skills"]]],
      children: [
        sectionHeading("02 / PRACTICE", "Skills"),
        {
          type: "div",
          attributes: [["class", ["about-page__skill-groups"]]],
          children: skills.map((skill) => SkillGroup(skill)),
        },
      ],
    });
  }

  const education = parcoursSection({
    label: "03 / EDUCATION",
    title: "",
    entries: journeys,
    className: "about-page__education",
  });
  const experiencesSection = parcoursSection({
    label: "04 / EXPERIENCES",
    title: "",
    entries: experiences,
    className: "about-page__experiences",
    alignEnd: true,
  });

  return [...sections, ...[education, experiencesSection].filter(Boolean)];
}

export default function AboutMePage() {
  loadAboutData();
  const footerProps = aboutState.profileRecord
    ? getFooterContactPropsFromProfile(aboutState.profileRecord)
    : footerContactCopy;

  return SiteLayout({
    currentPath: "/about-me",
    mainClassName: "about-page",
    footerProps,
    mainChildren: [
      {
        type: "div",
        attributes: [["class", ["about-page__content"]]],
        children: [
          ...aboutContent(),
          {
            type: "img",
            attributes: [
              ["class", ["about-page__focus-slashes"]],
              ["src", "/assets/images/decorative-focus-chevron.svg"],
              ["alt", ""],
              ["aria-hidden", "true"],
              ["width", 1440],
              ["height", 2529],
            ],
          },
        ],
      },
    ],
  });
}
