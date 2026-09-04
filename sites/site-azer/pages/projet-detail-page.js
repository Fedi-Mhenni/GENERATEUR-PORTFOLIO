import Sidebar from "../components/sidebar.js";
import ProjectDetail from "../components/project-detail.js";
import { getProfil } from "../services/strapi-api.js";

const MISSING_TEXT = "[Description à fournir]";

const PROJECT_DETAILS = {
  "cms-headless": {
    slug: "cms-headless",
    title: "CMS Headless",
    description:
      "Headless CMS platform for managing articles, users, and content with a secure admin dashboard.",
    screenshot: "/assets/projects/cms-headless-detail.png",
    badge: { type: "image", src: "/assets/projects/cms-headless-icon.png" },
    tags: ["React", "Laravel", "MySQL", "Git", "Docker"],
    features: [
      {
        icon: "icon-document",
        title: "Content Management",
        description: "Create, edit, and organize articles through a structured admin interface.",
      },
      {
        icon: "icon-users",
        title: "User Roles",
        description: "Manage permissions with role-based access for admins, editors, and viewers.",
      },
      {
        icon: "icon-image",
        title: "Media Library",
        description: "Upload and organize images and files with automatic optimization.",
      },
      {
        icon: "icon-lock",
        title: "Secure Authentication",
        description: "JWT-based login with password hashing and session management.",
      },
      {
        icon: "icon-api",
        title: "REST API",
        description: "Expose content through a documented REST API for any frontend.",
      },
    ],
    results: [
      "Centralized content management for multiple projects",
      "Reduced content update time for editors",
      "Secure, role-based access control",
      "Modular and scalable architecture",
      "Deployment with Docker & CI/CD",
    ],
    architecture: [
      { icon: "icon-user", label: "User" },
      { icon: "icon-monitor", label: "Web Interface" },
      { icon: "icon-server", label: "API Server" },
      { icon: "icon-document", label: "Strapi CMS" },
      { icon: "icon-layers", label: "Services" },
      { icon: "icon-database", label: "Database" },
    ],
    sourceDescription: MISSING_TEXT,
    repository: "https://github.com/azer-jouini",
  },
  "robot-assistant": {
    slug: "robot-assistant",
    title: "Robot Assistant",
    description:
      "Smart application that automates email replies, job applications, and data collection through workflows and API integrations.",
    screenshot: "/assets/projects/robot-assistant-screenshot.png",
    badge: { type: "icon", icon: "icon-robot" },
    tags: ["Python", "n8n", "REST API", "Git", "Docker"],
    features: [
      {
        icon: "icon-robot",
        title: "Bot Creation",
        description: "Create custom bots with a visual workflow editor",
      },
      {
        icon: "icon-database",
        title: "Data Collection",
        description: "Extract and process information from websites and APIs.",
      },
      {
        icon: "icon-monitor",
        title: "Dashboard",
        description: "Real-time execution tracking and performance analysis.",
      },
      {
        icon: "icon-contact",
        title: "Email Automation",
        description: "Automatic replies based on predefined rules.",
      },
      {
        icon: "icon-bell",
        title: "Smart Notifications",
        description: "Alerts via Slack, Email, Telegram, or Discord",
      },
    ],
    results: [
      "Automation of repetitive tasks",
      "Time savings and improved productivity",
      "Smart data processing",
      "Modular and scalable architecture",
      "Deployment with Docker & CI/CD",
    ],
    architecture: [
      { icon: "icon-user", label: "User" },
      { icon: "icon-monitor", label: "Web Interface" },
      { icon: "icon-server", label: "API server" },
      { icon: "icon-robot", label: "n8n engine" },
      { icon: "icon-layers", label: "Services" },
      { icon: "icon-database", label: "Database" },
    ],
    sourceDescription: MISSING_TEXT,
    repository: "https://github.com/azer-jouini",
  },
  "taskflow-api": {
    slug: "taskflow-api",
    title: "TaskFlow API",
    description:
      "Backend architecture based on microservices for collaborative management of projects, tasks, and teams, with CI/CD deployment.",
    screenshot: "/assets/projects/taskflow-screenshot.png",
    badge: { type: "icon", icon: "icon-document" },
    tags: ["Node.js", "CI/CD", "MySQL", "Git", "Docker"],
    features: [
      {
        icon: "icon-tasks",
        title: "Task Management",
        description: "Create, assign, and track tasks across teams and projects.",
      },
      {
        icon: "icon-users",
        title: "Team Collaboration",
        description: "Real-time updates and role-based access for team members.",
      },
      {
        icon: "icon-layers",
        title: "Microservices Architecture",
        description: "Independent services for scalability and maintainability.",
      },
      {
        icon: "icon-refresh",
        title: "CI/CD Pipeline",
        description: "Automated testing and deployment on every push.",
      },
      {
        icon: "icon-api",
        title: "REST API",
        description: "Documented endpoints for integration with any frontend.",
      },
    ],
    results: [
      "Scalable microservices architecture",
      "Automated deployment pipeline",
      "Improved team collaboration and tracking",
      "Modular and maintainable codebase",
      "Deployment with Docker & CI/CD",
    ],
    architecture: [
      { icon: "icon-user", label: "User" },
      { icon: "icon-monitor", label: "Web Interface" },
      { icon: "icon-server", label: "API Gateway" },
      { icon: "icon-tasks", label: "Task Service" },
      { icon: "icon-layers", label: "Services" },
      { icon: "icon-database", label: "Database" },
    ],
    sourceDescription: MISSING_TEXT,
    repository: "https://github.com/azer-jouini",
  },
};

export default async function ProjetDetailPage({ slug }) {
  const profil = await getProfil();
  const project = PROJECT_DETAILS[slug];

  const content = project
    ? ProjectDetail(project)
    : {
        type: "main",
        attributes: [["class", ["projects-page"]]],
        children: [{ type: "h1", children: ["Projet introuvable"] }],
      };

  return {
    type: "div",
    attributes: [["class", ["page-layout"]]],
    children: [Sidebar(profil, "/projects"), content],
  };
}
