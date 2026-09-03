import BrowserLink from "../vanilla-engine/src/router/link.js";
import CvLink from "./cv-link.js";

function withIcon(link, iconClass, label) {
  link.children = [
    { type: "span", attributes: [["class", ["icon", iconClass]]] },
    { type: "span", children: [label] },
  ];
  return link;
}

function navLink(url, label, iconClass, currentPath) {
  const link = withIcon(BrowserLink(url, label), iconClass, label);
  if (url === currentPath) {
    link.attributes.push(["class", ["is-active"]], ["aria-current", "page"]);
  }
  return link;
}

function externalLink(url, label, iconClass) {
  return withIcon(
    {
      type: "a",
      attributes: [["href", url], ["target", "_blank"], ["rel", "noopener noreferrer"]],
      children: [],
    },
    iconClass,
    label,
  );
}

export default function Sidebar(profil, currentPath) {
  const socialLinks = [
    profil?.github ? externalLink(profil.github, "GitHub", "icon-github") : null,
    profil?.linkedin ? externalLink(profil.linkedin, "LinkedIn", "icon-linkedin") : null,
  ].filter(Boolean);

  return {
    type: "aside",
    attributes: [["class", ["sidebar"]]],
    children: [
      {
        type: "nav",
        attributes: [["class", ["sidebar-nav"]], ["aria-label", "Main navigation"]],
        children: [
          navLink("/", "Home", "icon-home", currentPath),
          navLink("/about", "About", "icon-about", currentPath),
          navLink("/projects", "Projects", "icon-projects", currentPath),
          navLink("/contact", "Contact", "icon-contact", currentPath),
        ],
      },
      {
        type: "div",
        attributes: [["class", ["sidebar-social"]]],
        children: socialLinks,
      },
      CvLink(profil, ["btn-danger", "sidebar-cv"]),
    ].filter(Boolean),
  };
}
