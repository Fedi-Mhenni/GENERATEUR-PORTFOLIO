import Sidebar from "../components/sidebar.js";
import BrowserLink from "../vanilla-engine/src/router/link.js";
import resolveImageUrl from "../vanilla-engine/src/utils/resolve-url.js";
import getTechIconClasses from "../lib/tech-icons.js";
import { mergeProjectsWithStrapi } from "../data/projects.js";
import { getProfil, getProjets } from "../services/strapi-api.js";
import config from "../config.js";

const FALLBACK_INTRODUCTION =
  "Building modern, high-performing, and scalable web applications, from frontend to backend.";

function ctaLink(url, label, className) {
  const link = BrowserLink(url, label);
  link.attributes.push(["class", [className]]);
  return link;
}

function heroIntro(profil) {
  if (!profil) {
    return {
      type: "header",
      attributes: [["class", ["hero-intro"]]],
      children: [
        { type: "h1", children: ["Portfolio"] },
        {
          type: "p",
          attributes: [["class", ["hero-description"]]],
          children: ["Impossible de charger le profil pour le moment."],
        },
      ],
    };
  }

  return {
    type: "header",
    attributes: [["class", ["hero-intro"]]],
    children: [
      { type: "h1", children: [`${profil.prenom} ${profil.nom}`] },
      ...(profil.poste ? [{ type: "p", attributes: [["class", ["hero-role"]]], children: [profil.poste] }] : []),
      {
        type: "p",
        attributes: [["class", ["hero-description"]]],
        children: [profil.introduction || FALLBACK_INTRODUCTION],
      },
      {
        type: "div",
        attributes: [["class", ["hero-actions"]]],
        children: [
          ctaLink("/projects", "View my projects", "btn-primary"),
          ctaLink("/contact", "Contact me!", "btn-secondary"),
        ],
      },
    ],
  };
}

function heroVisual(profil) {
  const photoUrl = resolveImageUrl(profil?.photo?.url, config.STRAPI_ORIGIN);

  return {
    type: "div",
    attributes: [["class", ["hero-visual"]]],
    children: [
      {
        type: "div",
        attributes: [["class", ["hero-visual-decor"]], ["aria-hidden", "true"]],
        children: [
          { type: "span", attributes: [["class", ["hero-visual-shape-1"]]] },
          { type: "span", attributes: [["class", ["hero-visual-shape-2"]]] },
          { type: "span", attributes: [["class", ["hero-visual-shape-3"]]] },
        ],
      },
      ...(photoUrl
        ? [
            {
              type: "img",
              attributes: [
                ["src", photoUrl],
                ["alt", `Photo de profil de ${profil.prenom} ${profil.nom}`],
                ["class", ["hero-photo"]],
              ],
            },
          ]
        : []),
    ],
  };
}

function homeProjectTag(name) {
  return {
    type: "span",
    attributes: [["class", ["home-project-tag"]]],
    children: [
      { type: "span", attributes: [["class", getTechIconClasses(name)]] },
      { type: "span", children: [name] },
    ],
  };
}

function homeProjectCard(project) {
  const link = BrowserLink(`/projects/${project.slug}`, project.title);
  link.attributes.push(["class", ["home-project-card"]]);
  link.children = [
    {
      type: "img",
      attributes: [
        ["src", project.screenshot],
        ["alt", `Capture d'écran du projet ${project.title}`],
        ["class", ["home-project-card-image"]],
      ],
    },
    {
      type: "div",
      attributes: [["class", ["home-project-card-body"]]],
      children: [
        { type: "h3", children: [project.title] },
        {
          type: "div",
          attributes: [["class", ["home-project-card-tags"]]],
          // Aperçu compact : les 3 premières technos suffisent, la page
          // Projects affiche déjà la liste complète.
          children: project.technos.slice(0, 3).map(homeProjectTag),
        },
      ],
    },
  ];
  return link;
}

export default async function HomePage() {
  const [profil, projets] = await Promise.all([getProfil(), getProjets()]);
  const projects = mergeProjectsWithStrapi(projets);

  return {
    type: "div",
    attributes: [["class", ["page-layout"]]],
    children: [
      Sidebar(profil, "/"),
      {
        type: "main",
        attributes: [["class", ["home-page"]]],
        children: [
          {
            type: "section",
            attributes: [["class", ["hero"]]],
            children: [heroIntro(profil), heroVisual(profil)],
          },
          {
            type: "section",
            attributes: [["class", ["home-projects"]]],
            children: [
              { type: "h2", children: ["Recent Projects"] },
              {
                type: "div",
                attributes: [["class", ["home-projects-grid"]]],
                children: projects.map(homeProjectCard),
              },
            ],
          },
        ],
      },
    ],
  };
}
