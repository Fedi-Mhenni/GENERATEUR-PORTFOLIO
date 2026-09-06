import AmbientBlur from "../components/ambient-blur.js";
import ArchivePagination from "../components/archive-pagination.js";
import ProjectCard from "../components/project-card.js";
import SiteLayout from "../components/site-layout.js";
import { getProjetsPage } from "../services/strapi-api.js";
import adaptProjectToCard from "./adapt-project-to-card.js";
import getFooterContactProps from "./get-footer-contact-props.js";
import { projectsArchiveCopy } from "./static-site-content.js";

const projectsPerPage = 6;

async function loadProjectsPage(requestedPage) {
  let response = await getProjetsPage({
    page: requestedPage,
    pageSize: projectsPerPage,
  });
  let pagination = response.meta?.pagination ?? {};
  const totalPages = Math.max(1, pagination.pageCount ?? 1);
  const currentPage = Math.min(pagination.page ?? requestedPage, totalPages);

  // Strapi returns an empty collection for an out-of-range page. Fetch the
  // last valid page so the address bar never produces an empty archive.
  if (currentPage !== requestedPage) {
    response = await getProjetsPage({
      page: currentPage,
      pageSize: projectsPerPage,
    });
    pagination = response.meta?.pagination ?? {};
  }

  return {
    projects: response.data ?? [],
    currentPage,
    totalPages: Math.max(1, pagination.pageCount ?? totalPages),
  };
}

export default async function ProjectsPage() {
  const requestedPage = Number.parseInt(
    new URLSearchParams(window.location.search).get("page") ?? "1",
    10,
  );
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const footerPropsPromise = getFooterContactProps();
  let projectsPage;
  let projectsLoadFailed = false;

  try {
    projectsPage = await loadProjectsPage(page);
  } catch (error) {
    console.error("Impossible de charger les projets Strapi.", error);
    projectsLoadFailed = true;
    projectsPage = { projects: [], currentPage: 1, totalPages: 1 };
  }

  const footerProps = await footerPropsPromise;
  const visibleProjects = projectsPage.projects.map(adaptProjectToCard);

  function changePage(page) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("page", String(page));
    window.history.pushState({}, "", nextUrl);
    window.dispatchEvent(new Event("pushstate"));
  }

  return SiteLayout({
    currentPath: "/projects",
    mainClassName: "projects-page",
    footerProps,
    mainChildren: [
      AmbientBlur({
        src: "/assets/images/ambient-blur-upper-right.svg",
        width: 704,
        height: 704,
      }),
      {
        type: "div",
        attributes: [["class", ["projects-page__content"]]],
        children: [
          {
            type: "header",
            attributes: [["class", ["projects-page__heading"]]],
            children: [
              {
                type: "p",
                attributes: [["class", ["type-label", "projects-page__eyebrow"]]],
                children: [projectsArchiveCopy.eyebrow],
              },
              {
                type: "h1",
                attributes: [["class", ["type-heading-primary"]]],
                children: [projectsArchiveCopy.title],
              },
              {
                type: "p",
                attributes: [["class", ["projects-page__introduction"]]],
                children: [projectsArchiveCopy.introduction],
              },
            ],
          },
          {
            type: "ul",
            attributes: [["class", ["projects-page__archive"]]],
            children: visibleProjects.map((project) => ({
              type: "li",
              children: [
                ProjectCard(project),
              ],
            })),
          },
          ...(projectsLoadFailed
            ? [
                {
                  type: "p",
                  attributes: [["role", ["status"]]],
                  children: ["Projects are temporarily unavailable."],
                },
              ]
            : []),
          ArchivePagination({
            currentPage: projectsPage.currentPage,
            totalPages: projectsPage.totalPages,
            onPageChange: changePage,
            previousLabel: "← Previous",
            nextLabel: "Next →",
          }),
        ],
      },
    ],
  });
}
