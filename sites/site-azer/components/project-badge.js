export default function ProjectBadge(badge) {
  if (badge.type === "image") {
    return {
      type: "img",
      attributes: [["src", badge.src], ["alt", ""], ["class", ["project-badge-image"]]],
    };
  }

  return { type: "span", attributes: [["class", ["icon", badge.icon]]] };
}
