import BrowserLink from "../vanilla-engine/src/router/link.js";
import validateProps from "../vanilla-engine/src/validation/validate-props.js";

const schema = {
  title: { type: "string", required: true },
  href: { type: "string", required: false, default: "" },
  category: { type: "string", required: false, default: "" },
  description: { type: "string", required: false, default: "" },
  technologies: { type: "string", required: false, default: "" },
  imageUrl: { type: "string", required: false, default: "" },
  imageAlt: { type: "string", required: false, default: "" },
  imageWidth: { type: "number", required: false },
  imageHeight: { type: "number", required: false },
  detailLabel: { type: "string", required: false, default: "View project detail" },
};

function projectImage(props) {
  if (!props.imageUrl) {
    return null;
  }

  const attributes = [
    ["class", ["project-card__image"]],
    ["src", props.imageUrl],
    ["alt", props.imageAlt],
  ];

  if (props.imageWidth) {
    attributes.push(["width", props.imageWidth]);
  }

  if (props.imageHeight) {
    attributes.push(["height", props.imageHeight]);
  }

  return { type: "img", attributes };
}

export default function ProjectCard(props) {
  const { valid, errors, props: finalProps } = validateProps(props, schema);

  if (!valid) {
    console.error("ProjectCard: props invalides —", errors.join(", "));
  }

  const media = projectImage(finalProps);
  const metadata = [
    finalProps.category
      ? {
          type: "p",
          attributes: [["class", ["project-card__category", "type-label"]]],
          children: [finalProps.category],
        }
      : null,
  ].filter(Boolean);

  const content = [
    ...metadata,
    {
      type: "h2",
      attributes: [["class", ["project-card__title", "type-heading-secondary"]]],
      children: [finalProps.title ?? "Projet"],
    },
    finalProps.description
      ? {
          type: "p",
          attributes: [["class", ["project-card__description"]]],
          children: [finalProps.description],
        }
      : null,
    finalProps.technologies
      ? {
          type: "p",
          attributes: [["class", ["project-card__technologies", "type-label"]]],
          children: [finalProps.technologies],
        }
      : null,
  ].filter(Boolean);

  if (finalProps.href) {
    const detailLink = BrowserLink(
      finalProps.href,
      finalProps.detailLabel ?? "View project detail",
    );
    detailLink.attributes.push([
      "class",
      ["button", "project-card__detail-link"],
    ]);
    content.push(detailLink);
  }

  return {
    type: "article",
    attributes: [["class", ["project-card"]]],
    children: [
      {
        type: "div",
        attributes: [
          ["class", ["project-card__media"]],
          ...(!media || !finalProps.imageAlt ? [["aria-hidden", "true"]] : []),
        ],
        children: media ? [media] : [],
      },
      {
        type: "div",
        attributes: [["class", ["project-card__content"]]],
        children: content,
      },
    ],
  };
}
