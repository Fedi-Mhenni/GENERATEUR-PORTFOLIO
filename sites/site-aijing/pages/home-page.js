import BrowserLink from "../vanilla-engine/src/router/link.js";
import ProjectCard from "../components/project-card.js";
import SiteLayout from "../components/site-layout.js";
import { getLatestProjets, getProfil } from "../services/strapi-api.js";
import adaptProfileToHome from "./adapt-profile-to-home.js";
import adaptProjectToCard from "./adapt-project-to-card.js";
import { getFooterContactPropsFromProfile } from "./get-footer-contact-props.js";
import { homeCopy } from "./static-site-content.js";

const latestProjectsState = {
  status: "loading",
  projects: [],
};

let latestProjectsRequest;

function refreshHome() {
  if (window.location.pathname === "/") {
    window.dispatchEvent(new Event("pushstate"));
  }
}

function loadLatestProjects() {
  if (latestProjectsRequest) {
    return;
  }

  latestProjectsRequest = getLatestProjets()
    .then((projects) => {
      latestProjectsState.projects = Array.isArray(projects) ? projects : [];
      latestProjectsState.status = latestProjectsState.projects.length
        ? "success"
        : "empty";
    })
    .catch((error) => {
      console.error("Impossible de charger les derniers projets Strapi.", error);
      latestProjectsState.status = "error";
    })
    .finally(refreshHome);
}

async function loadHomeProfile() {
  try {
    return await getProfil();
  } catch (error) {
    console.error("Impossible de charger le profil Strapi.", error);
    return null;
  }
}

function pageLink(href, label, className) {
  const link = BrowserLink(href, label);
  link.attributes.push(["class", ["button", className]]);
  return link;
}

function latestProjectsContent() {
  if (latestProjectsState.status === "loading") {
    return [{
      type: "p",
      attributes: [["class", ["home-page__projects-status"]], ["role", "status"]],
      children: ["Loading latest projects…"],
    }];
  }

  if (latestProjectsState.status === "error") {
    return [{
      type: "p",
      attributes: [["class", ["home-page__projects-status"]], ["role", "alert"]],
      children: ["Latest projects are temporarily unavailable."],
    }];
  }

  if (latestProjectsState.status === "empty") {
    return [{
      type: "p",
      attributes: [["class", ["home-page__projects-status"]]],
      children: ["No projects are available yet."],
    }];
  }

  return [{
    type: "ol",
    attributes: [["class", ["home-page__project-list"]]],
    children: latestProjectsState.projects.map((project) => ({
      type: "li",
      children: [ProjectCard({
        ...adaptProjectToCard(project),
        variant: "featured",
        detailLabel: homeCopy.projectDetailLabel,
      })],
    })),
  }];
}

export default async function HomePage() {
  loadLatestProjects();
  const profile = await loadHomeProfile();
  const hero = adaptProfileToHome(profile, homeCopy);
  const footerProps = getFooterContactPropsFromProfile(profile);

  return SiteLayout({
    currentPath: "/",
    mainClassName: "home-page",
    footerProps,
    mainChildren: [
      {
        type: "div",
        attributes: [["class", ["home-page__content"]]],
        children: [
          {
            type: "section",
            attributes: [["class", ["home-page__hero"]]],
            children: [
              {
                type: "div",
                attributes: [["class", ["home-page__hero-copy"]]],
                children: [
                  {
                    type: "p",
                    attributes: [["class", ["home-page__eyebrow", "type-label"]]],
                    children: [homeCopy.heroEyebrow],
                  },
                  {
                    type: "h1",
                    attributes: [["class", ["type-display-brand"]]],
                    children: [hero.title],
                  },
                  {
                    type: "p",
                    attributes: [["class", ["home-page__hero-introduction"]]],
                    children: [hero.introduction],
                  },
                  pageLink("/about-me", homeCopy.heroCta, "home-page__hero-cta"),
                ],
              },
              {
                type: "img",
                attributes: [
                  ["class", ["home-page__portrait"]],
                  ["src", hero.photoSrc],
                  ["alt", hero.photoAlt],
                  ["width", hero.photoWidth],
                  ["height", hero.photoHeight],
                ],
              },
            ],
          },
          {
            type: "section",
            attributes: [["class", ["home-page__latest-projects"]]],
            children: [
              {
                type: "header",
                attributes: [["class", ["home-page__section-heading"]]],
                children: [
                  {
                    type: "p",
                    attributes: [["class", ["home-page__eyebrow", "type-label"]]],
                    children: [homeCopy.latestProjectsEyebrow],
                  },
                  {
                    type: "h2",
                    attributes: [["class", ["type-heading-primary"]]],
                    children: [homeCopy.latestProjectsTitle],
                  },
                ],
              },
              ...latestProjectsContent(),
              pageLink("/projects", homeCopy.projectsCta, "home-page__projects-cta"),
            ],
          },
          {
            type: "img",
            attributes: [
              ["class", ["home-page__focus-slashes"]],
              ["src", "/assets/images/decorative-focus-slashes.svg"],
              ["alt", ""],
              ["aria-hidden", "true"],
              ["width", 1440],
              ["height", 1919],
            ],
          },
        ],
      },
    ],
  });
}
