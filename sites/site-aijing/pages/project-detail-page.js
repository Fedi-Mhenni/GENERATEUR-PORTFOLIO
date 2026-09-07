import BrowserLink from "../vanilla-engine/src/router/link.js";
import AmbientBlur from "../components/ambient-blur.js";
import Gallery from "../components/gallery.js";
import NarrativeRow from "../components/narrative-row.js";
import ProjectDetailPagination from "../components/project-detail-pagination.js";
import SiteLayout from "../components/site-layout.js";
import SocialLink from "../components/social-link.js";
import { getProjetBySlug, getProjetsByDate } from "../services/strapi-api.js";
import adaptProjectToDetail from "./adapt-project-to-detail.js";
import getFooterContactProps from "./get-footer-contact-props.js";
import { pathFor, t } from "../i18n/index.js";

const projectStates = new Map();

function projectSlug(value) {
  return typeof value === "string" ? value.trim() : "";
}

function refreshProjectDetail(slug, locale) {
  if (window.location.pathname === pathFor(locale, "project", { slug })) {
    window.dispatchEvent(new Event("pushstate"));
  }
}

function projectNeighbours(projects, slug, locale) {
  const currentIndex = projects.findIndex((project) => project?.slug === slug);

  if (currentIndex === -1) {
    return { previousHref: "", nextHref: "" };
  }

  const previous = projects[currentIndex - 1];
  const next = projects[currentIndex + 1];

  return {
    previousHref: previous?.slug ? pathFor(locale, "project", { slug: previous.slug }) : "",
    nextHref: next?.slug ? pathFor(locale, "project", { slug: next.slug }) : "",
  };
}

async function loadProjectDetail(slug, locale) {
  const project = await getProjetBySlug(slug);

  if (!project) {
    return { status: "not-found" };
  }

  const detail = adaptProjectToDetail(project, locale);

  try {
    const projects = await getProjetsByDate();
    return {
      status: "success",
      detail,
      neighbours: projectNeighbours(Array.isArray(projects) ? projects : [], slug, locale),
    };
  } catch (error) {
    console.error("Impossible de charger la navigation des projets Strapi.", error);
    return {
      status: "success",
      detail,
      neighbours: { previousHref: "", nextHref: "" },
    };
  }
}

function projectState(slug, locale) {
  if (!slug) {
    return { status: "not-found" };
  }

  const stateKey = `${locale}:${slug}`;
  const currentState = projectStates.get(stateKey);

  if (currentState) {
    return currentState;
  }

  const state = { status: "loading" };
  projectStates.set(stateKey, state);

  loadProjectDetail(slug, locale)
    .then((result) => Object.assign(state, result))
    .catch((error) => {
      console.error("Impossible de charger le projet Strapi.", error);
      state.status = "error";
    })
    .finally(() => refreshProjectDetail(slug, locale));

  return state;
}

function pageLink(href, label, className) {
  const link = BrowserLink(href, label);
  link.attributes.push(["class", ["button", className]]);
  return link;
}

function projectMedia(detail) {
  if (detail.imageUrl) {
    const attributes = [
      ["class", ["project-detail-page__image"]],
      ["src", detail.imageUrl],
      ["alt", detail.imageAlt],
    ];

    if (detail.imageWidth) {
      attributes.push(["width", detail.imageWidth]);
    }

    if (detail.imageHeight) {
      attributes.push(["height", detail.imageHeight]);
    }

    return { type: "img", attributes };
  }

  return {
    type: "div",
    attributes: [["class", ["project-detail-page__media-placeholder"]]],
    children: [
      {
        type: "p",
        attributes: [["class", ["project-detail-page__media-category", "type-label"]]],
        children: [detail.category],
      },
      {
        type: "p",
        attributes: [["class", ["project-detail-page__media-title"]]],
        children: [detail.title],
      },
      {
        type: "p",
        attributes: [["class", ["project-detail-page__media-technologies", "type-label"]]],
        children: [detail.technologies],
      },
    ],
  };
}

function projectHero(detail, locale) {
  const metadata = detail.date ? `${t("project.datePrefix")}  ${detail.date}` : "";

  return {
    type: "section",
    attributes: [["class", ["project-detail-page__hero"]]],
    children: [
      {
        type: "figure",
        attributes: [["class", ["project-detail-page__media"]]],
        children: [projectMedia(detail)],
      },
      {
        type: "div",
        attributes: [["class", ["project-detail-page__hero-copy"]]],
        children: [
          {
            type: "p",
            attributes: [["class", ["project-detail-page__eyebrow", "type-label"]]],
            children: [detail.category],
          },
          {
            type: "h1",
            attributes: [["class", ["project-detail-page__title", "type-heading-primary"]]],
            children: [detail.title],
          },
          ...(metadata
            ? [{
                type: "p",
                attributes: [["class", ["project-detail-page__metadata", "type-label"]]],
                children: [metadata],
              }]
            : []),
          ...(detail.description
            ? [{
                type: "p",
                attributes: [["class", ["project-detail-page__description"]]],
                children: [detail.description],
              }]
            : []),
          ...(detail.technologies
            ? [{
                type: "p",
                attributes: [["class", ["project-detail-page__technologies", "type-label"]]],
                children: [detail.technologies],
              }]
            : []),
          {
            type: "div",
            attributes: [["class", ["project-detail-page__actions"]]],
            children: [
              pageLink(pathFor(locale, "projects"), t("project.back"), "project-detail-page__back-link"),
              ...(detail.githubUrl
                ? [SocialLink({
                    href: detail.githubUrl,
                    label: "GitHub",
                    iconSrc: "/assets/images/github_logo.png",
                    newTab: true,
                  })]
                : []),
            ],
          },
        ],
      },
    ],
  };
}

function statusContent(status, title, copy, locale) {
  return [{
    type: "section",
    attributes: [
      ["class", ["project-detail-page__status"]],
      ...(status ? [["role", status]] : []),
    ],
    children: [
      { type: "h1", attributes: [["class", ["type-heading-primary"]]], children: [title] },
      { type: "p", children: [copy] },
      ...(status === "status" ? [] : [pageLink(pathFor(locale, "projects"), t("project.back"), "project-detail-page__back-link")]),
    ],
  }];
}

function projectDetailContent(state, locale) {
  if (state.status === "loading") {
    return statusContent("status", t("project.loadingTitle"), t("project.loadingCopy"), locale);
  }

  if (state.status === "error") {
    return statusContent("alert", t("project.unavailableTitle"), t("project.unavailableCopy"), locale);
  }

  if (state.status === "not-found") {
    return statusContent("", t("project.notFoundTitle"), t("project.notFoundCopy"), locale);
  }

  return [
    projectHero(state.detail, locale),
    ...(state.detail.narratives.length
      ? [{
          type: "div",
          attributes: [["class", ["project-detail-page__narratives"]]],
          children: state.detail.narratives.map((section) => NarrativeRow(section)),
        }]
      : []),
    ...(state.detail.galleryImages.length
      ? [Gallery({
          images: state.detail.galleryImages,
          label: t("project.galleryLabel"),
          title: t("project.galleryTitle"),
        })]
      : []),
    ProjectDetailPagination({
      previousHref: state.neighbours.previousHref,
      nextHref: state.neighbours.nextHref,
      previousLabel: t("project.previous"),
      nextLabel: t("project.next"),
      ariaLabel: t("project.navigationLabel"),
    }),
  ];
}

export default async function ProjectDetailPage({ slug, locale = "en" } = {}) {
  const normalizedSlug = projectSlug(slug);
  const state = projectState(normalizedSlug, locale);
  const footerProps = await getFooterContactProps(locale);

  return SiteLayout({
    currentPath: pathFor(locale, "projects"),
    mainClassName: "project-detail-page",
    footerProps,
    locale,
    mainChildren: [
      AmbientBlur({
        src: "/assets/images/ambient-blur-upper-right.svg",
        width: 704,
        height: 704,
      }),
      {
        type: "div",
        attributes: [["class", ["project-detail-page__content"]]],
        children: projectDetailContent(state, locale),
      },
    ],
  });
}
