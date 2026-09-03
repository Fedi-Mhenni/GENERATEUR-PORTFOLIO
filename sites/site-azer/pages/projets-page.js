import Sidebar from "../components/sidebar.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import { getProfil, getProjets } from "../services/strapi-api.js";

const FIGMA_PROJECTS = [
  {
    slug: "cms-headless",
    title: "CMS Headless",
    description:
      "Headless CMS platform for managing articles, users, and content with a secure admin dashboard.",
    screenshot: "/assets/projects/cms-headless-screenshot.png",
    badge: { type: "image", src: "/assets/projects/cms-headless-icon.png" },
    technos: ["React", "Laravel", "MySQL", "Git", "Docker"],
  },
  {
    slug: "robot-assistant",
    title: "Robot Assistant",
    description:
      "Smart application that automates email replies, job applications, and data collection through workflows and API integrations.",
    screenshot: "/assets/projects/robot-assistant-screenshot.png",
    badge: { type: "icon", icon: "icon-robot" },
    technos: ["python", "n8n", "REST API", "Git", "Docker"],
  },
  {
    slug: "taskflow-api",
    title: "TaskFlow API",
    description:
      "Backend architecture based on microservices for collaborative management of projects, tasks, and teams, with CI/CD deployment.",
    screenshot: "/assets/projects/taskflow-screenshot.png",
    badge: { type: "icon", icon: "icon-document" },
    technos: ["node.js", "CI/CD", "MySQL", "Git", "Docker"],
  },
];

function mergeWithStrapi(figmaProject, strapiProjects) {
  const match = strapiProjects.find((p) => (p.attributes?.slug ?? p.slug) === figmaProject.slug);
  if (!match) {
    return figmaProject;
  }

  const titre = match.attributes?.titre ?? match.titre;
  const description = match.attributes?.description ?? match.description;

  return {
    ...figmaProject,
    title: titre ?? figmaProject.title,
    description: description ?? figmaProject.description,
  };
}

function projectBadge(project) {
  if (project.badge.type === "image") {
    return {
      type: "img",
      attributes: [["src", project.badge.src], ["alt", ""], ["class", ["project-badge-image"]]],
    };
  }

  return { type: "span", attributes: [["class", ["icon", project.badge.icon]]] };
}

function projectTag(name, index) {
  return {
    type: "span",
    attributes: [["class", ["project-tag", `project-tag-${index + 1}`]]],
    children: [name],
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
              { type: "span", attributes: [["class", ["project-badge"]]], children: [projectBadge(project)] },
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
  const projects = FIGMA_PROJECTS.map((project) => mergeWithStrapi(project, projets));

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
