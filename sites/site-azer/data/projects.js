export const FIGMA_PROJECTS = [
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

export function mergeProjectsWithStrapi(strapiProjects) {
  return FIGMA_PROJECTS.map((figmaProject) => {
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
  });
}
