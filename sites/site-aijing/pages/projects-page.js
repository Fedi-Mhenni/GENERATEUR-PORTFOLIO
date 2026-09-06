import AmbientBlur from "../components/ambient-blur.js";
import ArchivePagination from "../components/archive-pagination.js";
import ProjectCard from "../components/project-card.js";
import SiteLayout from "../components/site-layout.js";
import getFooterContactProps from "./get-footer-contact-props.js";
import { projectsTemporaryData } from "./projects-temporary-data.js";
import { projectsArchiveCopy } from "./static-site-content.js";

export default async function ProjectsPage() {
  const footerProps = await getFooterContactProps();

  const requestedPage = Number.parseInt(
    new URLSearchParams(window.location.search).get("page") ?? "1",
    10,
  );
  const projectsPerPage = projectsTemporaryData.length;
  const totalPages = Math.max(
    1,
    Math.ceil(projectsTemporaryData.length / projectsPerPage),
  );
  const currentPage = Math.min(
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    totalPages,
  );
  const visibleProjects = projectsTemporaryData.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage,
  );

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
                ProjectCard({
                  ...project,
                  href: `/projects/${project.slug}`,
                }),
              ],
            })),
          },
          ArchivePagination({
            currentPage,
            totalPages,
            onPageChange: changePage,
            previousLabel: "← Previous",
            nextLabel: "Next →",
          }),
        ],
      },
    ],
  });
}
