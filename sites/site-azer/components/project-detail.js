import BrowserLink from "../vanilla-engine/src/router/link.js";
import ProjectBadge from "./project-badge.js";
import getTechIconClasses from "../lib/tech-icons.js";

function backLink() {
  const link = BrowserLink("/projects", "Back to Projects");
  link.attributes.push(["class", ["project-detail-back"]]);
  link.children = [
    { type: "span", attributes: [["class", ["icon", "icon-arrow-left"]]] },
    { type: "span", children: ["Back to Projects"] },
  ];
  return link;
}

function heroSection(project) {
  return {
    type: "section",
    attributes: [["class", ["project-detail-hero"]]],
    children: [
      {
        type: "div",
        attributes: [["class", ["project-detail-intro"]]],
        children: [
          {
            type: "div",
            attributes: [["class", ["project-detail-title-row"]]],
            children: [
              { type: "span", attributes: [["class", ["project-badge"]]], children: [ProjectBadge(project.badge)] },
              { type: "h1", children: [project.title] },
            ],
          },
          {
            type: "p",
            attributes: [["class", ["project-detail-description"]]],
            children: [project.description],
          },
          {
            type: "div",
            attributes: [["class", ["project-detail-tags"]]],
            children: project.tags.map((tag) => ({
              type: "span",
              attributes: [["class", ["project-detail-tag"]]],
              children: [
                { type: "span", attributes: [["class", getTechIconClasses(tag)]] },
                { type: "span", children: [tag] },
              ],
            })),
          },
        ],
      },
      {
        type: "img",
        attributes: [
          ["src", project.screenshot],
          ["alt", `Capture d'écran du projet ${project.title}`],
          ["class", ["project-detail-screenshot"]],
        ],
      },
    ],
  };
}

function featureItem(feature, index) {
  return {
    type: "li",
    attributes: [["class", ["project-detail-feature"]]],
    children: [
      {
        type: "span",
        attributes: [["class", ["feature-icon-badge", `feature-icon-badge-${index + 1}`]]],
        children: [{ type: "span", attributes: [["class", ["icon", feature.icon]]] }],
      },
      {
        type: "div",
        children: [
          { type: "h3", children: [feature.title] },
          { type: "p", children: [feature.description] },
        ],
      },
    ],
  };
}

function resultItem(result) {
  return {
    type: "li",
    children: [
      { type: "span", attributes: [["class", ["icon", "icon-check", "project-detail-check"]]] },
      { type: "span", children: [result] },
    ],
  };
}

function featuresAndResultsSection(project) {
  return {
    type: "section",
    attributes: [["class", ["project-detail-grid"]]],
    children: [
      {
        type: "div",
        attributes: [["class", ["project-detail-features"]]],
        children: [
          { type: "h2", children: ["Key Features"] },
          {
            type: "ul",
            attributes: [["class", ["project-detail-features-list"]]],
            children: project.features.map((feature, index) => featureItem(feature, index)),
          },
        ],
      },
      {
        type: "div",
        attributes: [["class", ["project-detail-results"]]],
        children: [
          { type: "h2", children: ["Results Achieved"] },
          {
            type: "ul",
            children: project.results.map(resultItem),
          },
        ],
      },
    ],
  };
}

function architectureBox(node, index, total) {
  const box = {
    type: "div",
    attributes: [["class", ["architecture-box"]]],
    children: [
      {
        type: "span",
        attributes: [["class", ["architecture-icon-badge", `architecture-icon-badge-${index + 1}`]]],
        children: [{ type: "span", attributes: [["class", ["icon", node.icon]]] }],
      },
      { type: "span", children: [node.label] },
    ],
  };

  if (index === total - 1) {
    return [box];
  }

  return [box, { type: "span", attributes: [["class", ["architecture-arrow"]], ["aria-hidden", "true"]], children: ["→"] }];
}

function architectureSection(architecture) {
  return {
    type: "section",
    attributes: [["class", ["project-detail-architecture"]]],
    children: [
      { type: "h2", children: ["Architecture"] },
      {
        type: "div",
        attributes: [["class", ["architecture-diagram"]]],
        children: architecture.flatMap((node, index) => architectureBox(node, index, architecture.length)),
      },
    ],
  };
}

function sourceCodeSection(project) {
  const repoLink = {
    type: "a",
    attributes: [
      ["href", project.repository ?? "#"],
      ["target", "_blank"],
      ["rel", "noopener noreferrer"],
      ["class", ["project-detail-repo-button"]],
    ],
    children: [
      { type: "span", children: ["View Repository"] },
      { type: "span", attributes: [["class", ["icon", "icon-arrow-right"]]] },
    ],
  };

  return {
    type: "section",
    attributes: [["class", ["project-detail-source"]]],
    children: [
      { type: "span", attributes: [["class", ["icon", "icon-github"]]] },
      {
        type: "div",
        attributes: [["class", ["project-detail-source-text"]]],
        children: [
          { type: "h2", children: ["View Source Code"] },
          { type: "p", children: [project.sourceDescription] },
        ],
      },
      repoLink,
    ],
  };
}

export default function ProjectDetail(project) {
  return {
    type: "main",
    attributes: [["class", ["projects-page", "project-detail-page"]]],
    children: [
      backLink(),
      heroSection(project),
      featuresAndResultsSection(project),
      architectureSection(project.architecture),
      sourceCodeSection(project),
    ],
  };
}
