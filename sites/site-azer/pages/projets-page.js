import Sidebar from "../components/sidebar.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import ProjectBadge from "../components/project-badge.js";
import getTechIconClasses from "../lib/tech-icons.js";
import { mergeProjectsWithStrapi } from "../data/projects.js";
import { getProfil, getProjets } from "../services/strapi-api.js";

function projectTag(name, index) {
  return {
    type: "span",
    attributes: [["class", ["project-tag", `project-tag-${index + 1}`]]],
    children: [
      { type: "span", attributes: [["class", getTechIconClasses(name)]] },
      { type: "span", children: [name] },
    ],
  };
}

function projectCta(slug) {
  const link = BrowserLink(`/projects/${slug}`, "View Project");
  link.attributes.push(["class", ["project-card-cta"]]);
  link.children = [
    { type: "span", children: ["View Project"] },
    { type: "span", attributes: [["class", ["icon", "icon-arrow-right"]]] },
  ];
  return link;
}

function projectCard(project) {
  return {
    type: "article",
    attributes: [["class", ["project-card"]]],
    children: [
      {
        type: "img",
        attributes: [
          ["src", project.screenshot],
          ["alt", `Capture d'écran du projet ${project.title}`],
          ["class", ["project-card-screenshot"]],
        ],
      },
      {
        type: "div",
        attributes: [["class", ["project-card-body"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["project-card-heading"]]],
            children: [
              { type: "span", attributes: [["class", ["project-badge"]]], children: [ProjectBadge(project.badge)] },
              { type: "h2", children: [project.title] },
            ],
          },
          {
            type: "p",
            attributes: [["class", ["project-card-description"]]],
            children: [project.description],
          },
          {
            type: "div",
            attributes: [["class", ["project-card-tags"]]],
            children: project.technos.map((techno, index) => projectTag(techno, index)),
          },
          projectCta(project.slug),
        ],
      },
    ],
  };
}

export default async function ProjetsPage() {
  const [profil, projets] = await Promise.all([getProfil(), getProjets()]);
  const projects = mergeProjectsWithStrapi(projets);

  return {
    type: "div",
    attributes: [["class", ["page-layout"]]],
    children: [
      Sidebar(profil, "/projects"),
      {
        type: "main",
        attributes: [["class", ["projects-page"]]],
        children: [
          {
            type: "header",
            attributes: [["class", ["projects-header"]]],
            children: [
              {
                type: "div",
                attributes: [["class", ["projects-header-decor"]]],
                children: [
                  { type: "span", attributes: [["class", ["projects-header-stripe"]]] },
                  { type: "span", attributes: [["class", ["projects-header-stripe"]]] },
                  { type: "span", attributes: [["class", ["projects-header-stripe"]]] },
                ],
              },
              { type: "p", attributes: [["class", ["projects-header-label"]]], children: ["MY PROJECTS"] },
              { type: "h1", children: ["Academic Projects"] },
              {
                type: "p",
                attributes: [["class", ["projects-header-subtitle"]]],
                children: [
                  "Discover a selection of three academic projects completed during my university studies.",
                ],
              },
            ],
          },
          {
            type: "section",
            attributes: [["class", ["project-list"]]],
            children: projects.map(projectCard),
          },
        ],
      },
    ],
  };
}
