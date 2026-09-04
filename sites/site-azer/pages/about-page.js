import Sidebar from "../components/sidebar.js";
import { getProfil } from "../services/strapi-api.js";

const SKILL_CATEGORIES = [
  {
    title: "Frontend",
    items: ["HTML5", "CSS3", "JavaScript", "React.js", "Figma"],
    illustration: "/assets/about/frontend.png",
    badgeIcon: "icon-monitor",
  },
  {
    title: "Backend",
    items: ["Python", "PHP", "REST API", "Laravel", "Java / C"],
    illustration: "/assets/about/backend.png",
    badgeImage: "/assets/about/backend-icon.png",
  },
  {
    title: "Database",
    items: ["MongoDB", "MySQL", "PostgreSQL", "Data Modeling", "NoSQL"],
    illustration: "/assets/about/database.png",
    badgeImage: "/assets/about/database-icon.png",
  },
  {
    title: "DevOps",
    items: ["Git & GitHub", "Docker", "Deployments", "Environments", "CI/CD"],
    illustration: "/assets/about/devops.png",
    badgeImage: "/assets/about/devops-icon.png",
  },
  {
    title: "Security",
    items: ["OWASP", "JWT & Sessions", "Data Validation", "Password Hashing", "Data Protection"],
    illustration: "/assets/about/security.png",
    badgeImage: "/assets/about/security-icon.png",
  },
  {
    title: "Complete Project",
    items: ["Requirements Analysis", "Design & Planning", "Development", "Testing & Optimization", "Deployment"],
    illustration: "/assets/about/complete-project.png",
    badgeImage: "/assets/about/complete-project-icon.png",
  },
];

const HIGHLIGHTS = [
  { title: "Clean Code", description: "Readable, maintainable, and well-structured." },
  { title: "Performance", description: "Fast and optimized applications." },
  { title: "Solution", description: "From idea to deployment, I handle it all." },
];

function skillBadge(category) {
  if (category.badgeIcon) {
    return {
      type: "span",
      attributes: [["class", ["skill-badge", "skill-badge-frontend"]]],
      children: [{ type: "span", attributes: [["class", ["icon", category.badgeIcon]]] }],
    };
  }

  return {
    type: "img",
    attributes: [
      ["src", category.badgeImage],
      ["alt", ""],
      ["class", ["skill-badge", "skill-badge-image"]],
    ],
  };
}

function skillCard(category) {
  return {
    type: "article",
    attributes: [["class", ["skill-card"]]],
    children: [
      {
        type: "div",
        attributes: [["class", ["skill-card-content"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["skill-card-heading"]]],
            children: [skillBadge(category), { type: "h2", children: [category.title] }],
          },
          {
            type: "ul",
            children: category.items.map((item) => ({ type: "li", children: [item] })),
          },
        ],
      },
      {
        type: "img",
        attributes: [
          ["src", category.illustration],
          ["alt", ""],
          ["class", ["skill-card-illustration"]],
        ],
      },
    ],
  };
}

function highlightBadge(highlight) {
  return {
    type: "div",
    attributes: [["class", ["skill-highlight"]]],
    children: [
      { type: "h2", children: [highlight.title] },
      { type: "p", children: [highlight.description] },
    ],
  };
}

export default async function AboutPage() {
  const profil = await getProfil();

  return {
    type: "div",
    attributes: [["class", ["page-layout"]]],
    children: [
      Sidebar(profil, "/about"),
      {
        type: "main",
        attributes: [["class", ["skills-page"]]],
        children: [
          {
            type: "header",
            attributes: [["class", ["skills-header"]]],
            children: [
              { type: "h1", children: ["Full Stack Skills"] },
              { type: "p", children: ["I build complete web applications, from frontend to backend"] },
            ],
          },
          {
            type: "section",
            attributes: [["class", ["skills-grid"]]],
            children: SKILL_CATEGORIES.map(skillCard),
          },
          {
            type: "section",
            attributes: [["class", ["skills-highlights"]]],
            children: HIGHLIGHTS.map(highlightBadge),
          },
        ],
      },
    ],
  };
}
